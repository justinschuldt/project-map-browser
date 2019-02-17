# ProjectMap
![](https://github.com/justinschuldt/project-map-browser/blob/master/images/readme_logo.PNG)

## Overview
Many areas of the world are under-mapped and even in developed countries, disasters will cause meaningful topological changes to road networks, structures, and utilities.

ProjectMap is a novel and extensible framework superior to the standard “bounty”. We propose a split reward pool whereby users receive instant payout on verified map edits but contrary to the status quo will *continue* to receive royalty payments for the life of those edits. This is a natural gamification whereby edits in high demand areas or those which are commonly used in analysis will be rewarded.

Our royalty contract is engineered such that reward pools can incentivize more rapid response by enabling a time decay feature. It also provides mechanisms for the reward recipients to reinvest or donate funds back into the pool or to other humanitarian projects.

## About this repo
This is a React application built for browsers and phones. We demonstrate reading from and writing to our contracts as users interact with Google Maps. The onboarding process to earning Ether with ProjectMap was designed for anyone with an email account.

## Royalty Payment Mechanism
Our incentivization mechanism splits an initial contract pool into two new contracts, apportioning between a “bounty” and “royalty” payout. The contract owner can designate the percentage split – choosing to prefer the fixed one-time bounty approach or, conversely, they can apportion the majority to long-term taxation style economics whereby increased usage of a map edit tends to accrue value.

Below is a data structure demonstrating the three primary components of a fund: The “Project” (red) represents the total funding – for example a Government might spend $100,000 to map the schools across a country. The “Bounty” (black) in this case will take 30% (or $30,000) of the total funding and will be administered over 61 days beginning with ~ $1,000 per day then ramping linearly downward until minimal near-zero payment on close. Royalty payments (green) comprise $70,000 of the total pool funds paying out with exponential decay over a six-month period. 

![](https://github.com/justinschuldt/project-map-browser/blob/master/images/royalty_contract_model.PNG)

*Table 1 - A proposed structure for the essential elemtents .*



### The salient features of this model are as follows:
- We can assign decay/escalation profiles by mathematical “y=f(x)” functions, statistical distributions, or even random lottery assignment.
- Compute intensive math such as y=exp(x, power) could be coarsely modeled with lookup tables and augmented with linear interpolation. These approximations would consume less resources; a critical enhancement given computational cost on the EVM.
- Lookup tables could be extended to a variety of meanings in that they could be pointed to other contracts, libraries, or even API endpoints. For instance, the instant-payout bounty could be linked for example to storm intensity models of an approaching hurricane. As landfall models mature, resources would be redirected to the appropriate area. (Figure 5 depicts a "data rich" lookup, common with naturally-occuring phenomena)

Below are a series of charts depicting daily rate and cumulative reward balances for both linear and exponential decay. Of note is the tendency of different approaches to “front-weight” rewards favoring quicker completion vs those where the time value is less important than the overall utility as determined by popularity.


![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/linear_daily.PNG)

*Figure 1 - Plot showing basic linear reward decay for both bounty and royalty.*



![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/linear_cumulative.PNG)

*Figure 2 - Cumulative reward payouts over time. Note lower initial royalty payments still provide the majority of the total incentive.*



![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/exponential_daily.PNG)

*Figure 3 - Daily reward payouts in exponential decay. Front-weighted incentivization would encourage timely edits.*



![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/exponential_cumulative.PNG)

*Figure 4 - Cumulative rewards with exponential decay. Early edits and near-term consumption of map features accounts for a vast majority of incentive pool.*


![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/data-dense_daily.PNG)

*Figure 5 - A novel implementation whereby stochastic (random) or real-world process variations may be at play.*

## Built With

- React
- Typescript
- [Create React App Config Overrides](https://github.com/sharegate/craco)
- [Antd](https://ant.design/docs/react/introduce)

Smart contract repository can be found here(https://github.com/tspoff/project-map-solidity)
