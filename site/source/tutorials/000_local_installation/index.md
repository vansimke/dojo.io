---
title: Dojo 2 local installation
layout: tutorial
overview: Discover the basics of creating a Dojo 2 application.
paginate: false
---

# Dojo 2 local installation

## Overview
This tutorial covers setup of a local Dojo 2 environment.

## Creating a Dojo Application
First, we need to create a Dojo 2 project. Dojo 2 is powerful and leverages advanced tools for creating applications. It also provides a potent command-line tool to streamline the installation process, which is installed with the following terminal command:

```bash
npm install -g @dojo/cli
```

This command installs the Dojo command-line tool (`@dojo/cli`) to simplify development tasks related to creating, testing, and building your applications. Initially, the `@dojo/cli` tool comes with three commands:
* `create` - Provides a skeleton template for Dojo 2 projects
* `eject` - Disconnects a project from `@dojo/cli` allowing advanced users to customize configuration
* `version` - Reports the version of `@dojo/cli` and any commands that are installed

In order to create your first Dojo 2 application, run the following command in the directory that will host the new application:

```bash
dojo create --name first-dojo-2-app
```

{% aside 'Dojo create arguments' %}
Many of the arguments passed to `dojo create` have abbreviated versions. So `dojo create -n first-dojo-2-app` is equivalent to `dojo create --name first-dojo-2-app`.
{% endaside %}

This command will create the basic scaffolding for a Dojo 2 application in the newly created "first-dojo-2-app" directory with all of its dependencies pre-installed.

At this point, we've successfully created our first basic Dojo 2 application and installed its dependencies. Now it is time to see what our application can do! First, we are going to leverage another `@dojo/cli` command. You don't have to install this one, it was added when you installed the other dependencies. In the terminal, switch into the `first-dojo-2-app` directory and then enter the `dojo build --watch` command:

```bash
cd first-dojo-2-app
dojo build --watch --serve
```
(or, the shorter, `dojo build -w -s`)

This command will invoke Dojo 2's tool to build and transpile the project using [Webpack](https://webpack.github.io/), a popular tool for optimizing JavaScript source code. The `--watch` (or `-w`) flag watches and rebuilds your project whenever any changes are saved and the `--serve` (or `-s`) flag starts a simple web server which allows us to run our application in the browser while we make modifications.

In order to see what the application looks like, open a modern web browser (such as the latest version of Chrome, Edge, Firefox, Internet Explorer, or Safari) and navigate to [`http://localhost:9999`](http://localhost:9999). You will be greeted by a humble page that welcomes you to your new application.
