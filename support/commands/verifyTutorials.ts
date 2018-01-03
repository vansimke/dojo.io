import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, unlinkSync, readFileSync, createWriteStream } from 'fs';
import { join } from 'path';
import { platform } from 'os';
import * as md5 from 'md5';
import { logger } from '../log';

interface TutorialHashes {
	[key: string]: string;
}

export default async function verifyTutorials(tutorialRoot: string, projectExportDirectory: string, updateHashes: boolean = false) {
	const tutorialDirectories = readdirSync(tutorialRoot).filter(function (file) {
		const stat = statSync(join(tutorialRoot, file));
		return stat.isDirectory();
	});
	const tutorialHashPath = join('.', 'tutorialHashes.json');
	const tutorialHashes: TutorialHashes = existsSync(tutorialHashPath) ?
		JSON.parse(readFileSync(tutorialHashPath).toString()) : {};
	let count = 0;
	for (let tutorialDirectory of tutorialDirectories) {
		count++;
		const examplesRoot = join(tutorialRoot, tutorialDirectory, 'demo');
		if (existsSync(examplesRoot)) {
			for (let directory of readdirSync(examplesRoot)) {
				try {
					const exampleDirectory = join(examplesRoot, directory);
					if (!statSync(exampleDirectory).isDirectory()) {
						continue;
					}
					const tutorialName = tutorialDirectory.substring(Math.max(0, join(tutorialDirectory, '..').length - 1));
					logger.info(`Checking ${tutorialName} - ${directory}`);
					if (await hasChanged(exampleDirectory, tutorialHashes)) {
						logger.info('...change detected, updating...');
						installDeps(exampleDirectory);
						let isSuccessful = exportProject(exampleDirectory, projectExportDirectory, `${tutorialName}_${directory}`);
						if (directory === 'finished' && isSuccessful) {
							isSuccessful = testTutorial(exampleDirectory);
						}
						cleanup(exampleDirectory);
						if (updateHashes && isSuccessful) {
							tutorialHashes[exampleDirectory] = getTutorialSignature(exampleDirectory);
							await new Promise((resolve, reject) => {
								const file = createWriteStream(tutorialHashPath);
								file.on('finish', () => {
									logger.info('...updated complete!');
									resolve();
								});
								file.on('error', (error: Error) => {
									reject(error);
								});
								file.end(JSON.stringify(tutorialHashes));
							});
						}
					}
					else {
						logger.info('...no changes detected');
					}
				} catch (e) {
					logger.error(e);
				}
			}
		}
	}
}

function getTutorialSignature(exampleDirectory: string) {
	let hashChain = '';
	function processDirectory(directory: string) {
		readdirSync(directory).forEach((entry) => {
			const entryPath = join(directory, entry);
			if (statSync(entryPath).isDirectory()) {
				processDirectory(entryPath);
			}
			else {
				hashChain += md5(readFileSync(entryPath));
			}
		});
	}
	processDirectory(exampleDirectory);

	return md5(hashChain);
}

export async function hasChanged(exampleDirectory: string, tutorialHashes: TutorialHashes) {
	const oldHash = tutorialHashes[exampleDirectory];
	if (!oldHash) {
		return true;
	}

	const hash = getTutorialSignature(exampleDirectory);
	return oldHash !== hash;
}

export function installDeps(exampleDirectory: string) {
	let result: boolean;
	for (const subdir of readdirSync(exampleDirectory)) {
		const projectDirectory = join(exampleDirectory, subdir);
		if (!statSync(projectDirectory).isDirectory()) {
			continue;
		}

		try {
			execSync('npm i', {
				cwd: projectDirectory
			});
			result = true;

		} catch (e) {
			result = false;
			break;
		}
	}

	return result;
}

export function exportProject(exampleDirectory: string, projectExportDirectory: string, baseProjectName: string) {
	let result: boolean;
	for (const subdir of readdirSync(exampleDirectory)) {
		const projectDirectory = join(exampleDirectory, subdir);
		if (!statSync(projectDirectory).isDirectory()) {
			continue;
		}

		try {
			execSync('npm i @dojo/cli-export-project', {
				cwd: projectDirectory
			});
			execSync('dojo export', {
				cwd: projectDirectory
			});

			const moveCommand = platform() === 'win32' ? 'move' : 'mv';
			execSync(`${moveCommand} ${join(projectDirectory, subdir + '.project.json')} ${join(projectExportDirectory, baseProjectName + '.project.json')}`);

		} catch (e) {
			result = false;
			break;
		}
	}

	return result;
}

export function testTutorial(exampleDirectory: string) {
	let result: boolean;
	for (const subdir of readdirSync(exampleDirectory)) {
		const projectDirectory = join(exampleDirectory, subdir);
		if (!statSync(projectDirectory).isDirectory()) {
			continue;
		}

		try {
			execSync('dojo test', {
				cwd: projectDirectory
			});

			result = true;

		} catch (e) {
			result = false;
			break;
		}
	}

	return result;

}

export function cleanup(exampleDirectory: string) {
	for (const subdir of readdirSync(exampleDirectory)) {
		const projectDirectory = join(exampleDirectory, subdir);
		if (!statSync(projectDirectory).isDirectory()) {
			continue;
		}
		const delDirCommand = platform() === 'win32' ? 'rmdir /s /q' : 'rm -rf';

		[
			'node_modules',
			'_build',
			'coverage',
			'dist'
		].forEach((subdir) => {
			const dir = join(projectDirectory, subdir);
			if (existsSync(dir)) {
				execSync(`${delDirCommand} ${dir}`);
			};
		});

		if (existsSync(join(projectDirectory, 'coverage-final.lcov'))) {
			unlinkSync(join(projectDirectory, 'coverage-final.lcov'));
		}
	}
}
