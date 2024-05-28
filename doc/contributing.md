# Klimatkollen contribution guidelines

Thank you for wanting to contribute to Klimatkollen! Please read this before starting to code :)

## What to expect from the team

Klimatkollen is driven by a small team that does a lot more than coding. From media outreach and fundraising to data analysis and hackathons, there's a lot going on. We sometimes have to push changes through in sync with exernal deadlines, for example to publish some data at the same time as a debate article. In such times we might not be able to review all proposed changes as soon as we would like to. As a rule of thumb we aspire to respond to every issue/PR within a week, and often much faster than that.

## How to get in touch

The best way to get in touch with us is through the discord (link in README). It's a very active server and all the discussions happen there, as well as many other day-to-day updates. You can also email at hej@klimatkollen.se.

## Guide: How to make your first contribution

### Step 1. Find something to work on.

Either pick an issue from the GitHub issues tab, or create a new one to describe your suggestion/idea/bug report. 

If you are creating a new issue, make sure to look for similar ones first. Use the search function!

Issues labelled "good first issue" are the best to start with if you are new to the project. 

### Step 2. Let others know you're working on it.

Once you decide to pick an issue up, leave a comment saying so, to avoid others starting on the same one at the same time.

### Step 3. Make your changes

For most issues you will start with making sure you can run Klimatkollen locally, see [doc/getting-started.md] for instructions on that. 

Run `git log -1` to see the latest commit in your local repo, and make sure this is the same as the `staging` branch on GitHub. This is to make sure you are up to date on everyone's changes. 

(optional but recommended) Run `git checkout -b <issue-id>`, replacing `<issue-id>` with the id of the issue or another good name, to create a branch for you changes.

Make the code changes you would like to address the issue you are working on. It doesn't have to be perfect on first attempt, a prototype showing how an issue can be partially solved is already a step in the right direction. 

Commit your work. You can make multiple commits if you like, and we don't enforce any particular style commit messages.

### Don't forget!

Your code contribution must not introduce new warnings or errors, or reduce the quality of the code. We will check this as part of review, but you can make the process faster by making sure we won't find anything. 

Checklist before finishing your PR:

[ ] Run `npm run build` to compile all pages. Make sure there are no new warnings or errors.
[ ] Run `npm run lint` - same story.
[ ] Run `npm run start` to test the site locally and click through a few pages. Particularly focus on the places where you made your changes. 

Also consider what it will be like for someone else to read your code. Will they be able to read it and understand what's going on? 

### Step 4. Publish your work.

Push your commits to your fork of Klimatkollen. If you haven't created a fork already, use the "fork" button on GitHub and then add your fork as a remote by running `git remote add my-fork <git address of your fork>` where `my-fork` is an arbitrary name for the fork locally. 

Create a pull request. Either follow the link git showed after pushing to your fork, or create it from the GitHub web interface. Double check the branches in the PR! Make sure your are merging from your own branch, on your own repo, into "staging" on "klimatkollen". A common mistake is to accidentally start merging into "staging" on your own repo.

In the PR desscription, write "Fixes #XXX" where XXX is the id of the issue you are fixing. E.g. `Fixes #413`

If the PR is not ready for review yet, prefix the title wiht "Draft: ". Remove this once you're ready.

In the body, describe the changes you have made, what you have done to test your work, if there's anything you're unsure about, or if some parts of the code are unfinished. Focus on the changes and how they address the issues - but try to keep discussion of the issue itself, in the issue.

### Step 5. Get your work reviewed.

Once the PR is created and has left the "draft" stage, someone from the team will eventually review it. This can normally take at least a few days - please be patient. At the same time, it is completely fine to let us know you're waiting for a review on Discord, and ask if you are unsure about anything. 

The reviewer will most likely have some comments, questions, or feedback, which you will be expected to address. 

In some cases, the reviewer might make some changes to your PR themselves and commit it, if they need to get the fix in quickly. 

The reviewer might also conclude that the changes should not be made, or that there currently isn't time to review it. Such a scenario is unlikely but if it does happen, please be understanding and remember that the reviwer wants what's best for the project, just like you.

Klimatkollen's team has the final say on what goes into the code. 

### Step 6. After the PR is merged

It might take some days before code merged to `staging` is published to production. 

