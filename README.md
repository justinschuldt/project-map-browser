# ProjectMap
![](https://github.com/justinschuldt/project-map-browser/blob/master/images/readme_logo.PNG)

## Overview
Many areas of the world are under-mapped and even in developed countries, disasters will cause meaningful topological changes to road networks, structures, and utilities. In 2018 alone, natural disasters cost $160B and killed 10,400.

We propose a novel and extensible framework we feel to be superior to the standard “bounty”. We propose a split reward pool whereby users receive instant payout on verified map edits but contrary to the status quo will *continue* to receive royalty payments for the life of those edits. This is a natural gamification whereby edits in high demand areas or those which are commonly used in analysis will be rewarded.

Our royalty contract is engineered such that reward pools can incentivize more rapid response by enabling a time decay feature. It also provides mechanisms for the reward recipients to reinvest or donate funds back into the pool or to other humanitarian projects.

## Royalty Payment Mechanism

![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/linear_daily.PNG)
Figure 1 - Plot showing basic linear reward decay for both bounty and royalty.

![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/linear_cumulative.PNG)
Figure 2 - Cumulative reward payouts over time. Note lower initial royalty payments still provide the majority of the total incentive.

![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/exponential_daily.PNG)
Figure 3 - Daily reward payouts in exponential decay. Front-weighted incentivization would encourage timely edits.

![](https://github.com/justinschuldt/project-map-browser/blob/master/images/charts/exponential_cumulative.PNG)
Figure 4 - Cumulative rewards with exponential decay. Early edits and near-term consumption of map features accounts for a vast majority of incentive pool.

## built with

- React
- Typescript
 - [Create React App Config Overrides](https://github.com/sharegate/craco)
 - [Antd](https://ant.design/docs/react/introduce)
