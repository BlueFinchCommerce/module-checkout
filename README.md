[![CircleCI](https://dl.circleci.com/status-badge/img/gh/genecommerce/template-module/tree/master.svg?style=svg&circle-token=1df10ade4cc4081e7811aa16430d10dd288cb969)](https://dl.circleci.com/status-badge/redirect/gh/genecommerce/template-module/tree/master)

# Template Repo for Magento 2 Modules

## What is this?

This is a project to allow you to easily setup a module for Magento 2.

The idea behind this is to have everything you need to easily create a module and keep it up to date.

---

## Why should we do this?

By adding functionailty in as a module we can make them easy to upgrade and reuse across different projects.

We can also make sure that we are using the same standards across all projects and showing our best work here at Gene.

---
## What does this example contain

1. Example ReadMe file for you to edit
2. All the files you need to get started for a module
3. All the CircleCi required to test your module before using it in your projects.

---
## What should my ReadMe file contain

Your ReadMe file should contain the following.

What version your package is on currently.

A change log of what has been changed between versions.

Some screenshots or video of the module in action.

---
## CircleCi

CircleCi is a tool for us to use to allow for tested to be run on our modules before they are deployed.

This template comes with EsLint and PHPStan.

You can add more tests to this if you need to.

---

## Testing your module locally

You can test CircleCi before you push your code.

To do this you need to install circleci locally.

``` brew install circleci```

then once this has been installed in the main directory of your package then.

```circleci local execute```

---

## Versioning

We will be using the Semantic Versioning to release our packages.

This means as follows

**Major** - A version where incompatible change has been made to the module meaning it will not longer work with existing versions.

**Minor** - A version where you have added additional functionailty in a backwards compatible manner.

**Patch** - A version where you make backwards compatible bug fixes.

For more information about Semantic Versioning see **[here](https://semver.org/)**.

---
## Tagging a new release

To get this module into composer we need to make a release.

To do this first.

Make sure your composer.json file has the latest up to date version number.

You have added the change to the readme file.

Then in command line.

```git tag [Your version number here]```

```git push origin --tags```

You will now be able to see this in the releases in GitHub.

---






