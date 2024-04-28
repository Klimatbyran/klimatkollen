## Klimatkollen

This is the official source code for [klimatkollen.se](https://klimatkollen.se).

## Free our climate data!

Klimatkollen is an open source and citizen-driven climate data platform aimed at visualising local climate data in Sweden.

<b>The problem:</b> Sweden’s 290 cities and municipalities are not slashing carbon emissions fast enough to be in line with the Paris Agreement. Climate data that can help us is often locked behind paywalls, or sits in complex government databases. If we can’t clearly see how much CO<sup>2</sup> is being emitted, from which sources and how quickly we need to decarbonise – we can’t create a public opinion strong enough to change the course of our future. This needs to change.

That’s why we’re building a data-driven movement of climate-savvy developers to help us find and visualise climate data for the public. Climb aboard! <b>Join our [Discord](https://discord.gg/N5P64QPQ6v)</b> and set our climate data free! 

#Klimatkollen #FreeClimateData

## Building and running locally

If your're starting from scratch, and working with GitHub, NodeJS and so on is new to you, read [doc/getting-started.md](doc/getting-started.md). 

We use next.js and Typescript and it's pretty straightforward to get started. After cloning the repo run:

    npm ci
    npm run dev

This opens up a webserver on http://localhost:3000. Just edit the code and see the live refresh.

The project can also be run with docker (although with much slower refresh time):

    # builds the image
    docker build -t klimatkollen .

    # starts the container
    docker run -t -i --rm -p 3000:3000 --name klimatkollen klimatkollen

## Climate Data Pipeline Overview

Please see full [description here](data/README.md).

Feel free to explore the repository to understand more about how we collect, process, and display climate data.

## Contributing

The idea behind Klimatkollen is to give citizens access to the climate data we need to meet the goals of the Paris Agreement – and save our own future.

Do you have an idea for a feature you think should be added to the project? Before jumping into the code, it's a good idea to discuss your idea in the Discord server. That way you can find out if someone is already planning work in that area, or if your suggestion aligns with other people's thoughts. You can always submit an [issue](https://github.com/Klimatbyran/klimatkollen/issues) explaining your suggestion. We try to review the issues as soon as possible, but be aware that the team is at times very busy. Again, feel free to ask for a review on Discord!

Looking for ideas on what needs to be done? We appreciate help on existing [issues](https://github.com/Klimatbyran/klimatkollen/issues) very much. If you pick one up, remember to leave a comment saying you're working on it, and roughly when you expect to report progress. This helps others avoid double work and know what to expect.

Testing, bug fixes, typos or fact checking of our data is highly appreciated.

## Contact

Join the Discord server in the introduction or send an email to [hej@klimatkollen.se](mailto:hej@klimatkollen.se).

## Supporters and Partners

This work wouldn't have been possible without the support from

Google.org, Postkodstiftelsen.

We'd also like to thank our current and former partners

ClimateView, Klimatklubben.se, Researcher's Desk, Exponential Roadmap, WWF, We Don't Have Time, Våra Barns Klimat, Argand, StormGeo, Iteam, Precisit.

## LICENSE

MIT Copyright (c) Klimatbyrån
