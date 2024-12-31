# UintArrayUtils

## Overview

#### License: MIT

```solidity
library UintArrayUtils
```


## Functions info

### indexOf

```solidity
function indexOf(
    uint256[] memory A,
    uint256 a
) internal pure returns (uint256, bool)
```

Finds the index of the first occurrence of the given element.


Parameters:

| Name | Type      | Description                |
| :--- | :-------- | :------------------------- |
| A    | uint256[] | The input array to search  |
| a    | uint256   | The value to find          |


Return values:

| Name | Type    | Description                                                             |
| :--- | :------ | :---------------------------------------------------------------------- |
| [0]  | uint256 | Returns (index and isIn) for the first occurrence starting from index 0 |

### contains

```solidity
function contains(uint256[] memory A, uint256 a) internal pure returns (bool)
```

Returns true if the value is present in the list. Uses indexOf internally.


Parameters:

| Name | Type      | Description                |
| :--- | :-------- | :------------------------- |
| A    | uint256[] | The input array to search  |
| a    | uint256   | The value to find          |


Return values:

| Name | Type | Description                                                 |
| :--- | :--- | :---------------------------------------------------------- |
| [0]  | bool | Returns isIn for the first occurrence starting from index 0 |

### difference

```solidity
function difference(
    uint256[] memory A,
    uint256[] memory B
) internal pure returns (uint256[] memory)
```

Computes the difference of two arrays. Assumes there are no duplicates.


Parameters:

| Name | Type      | Description       |
| :--- | :-------- | :---------------- |
| A    | uint256[] | The first array   |
| B    | uint256[] | The second array  |


Return values:

| Name | Type      | Description                                    |
| :--- | :-------- | :--------------------------------------------- |
| [0]  | uint256[] | A - B; an array of values in A not found in B. |

### intersect

```solidity
function intersect(
    uint256[] memory A,
    uint256[] memory B
) internal pure returns (uint256[] memory)
```

Returns the intersection of two arrays. Arrays are treated as collections, so duplicates are kept.


Parameters:

| Name | Type      | Description       |
| :--- | :-------- | :---------------- |
| A    | uint256[] | The first array   |
| B    | uint256[] | The second array  |


Return values:

| Name | Type      | Description                        |
| :--- | :-------- | :--------------------------------- |
| [0]  | uint256[] | The intersection of the two arrays |

### extend

```solidity
function extend(
    uint256[] memory A,
    uint256[] memory B
) internal pure returns (uint256[] memory)
```

Returns the combination of two arrays


Parameters:

| Name | Type      | Description       |
| :--- | :-------- | :---------------- |
| A    | uint256[] | The first array   |
| B    | uint256[] | The second array  |


Return values:

| Name | Type      | Description             |
| :--- | :-------- | :---------------------- |
| [0]  | uint256[] | Returns A extended by B |
