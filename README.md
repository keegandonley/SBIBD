
<div align="center">

## SBIBD
[![forthebadge](https://forthebadge.com/images/badges/built-with-science.svg)](https://forthebadge.com)

</div>

Simple CLI for validating SBIBD configurations and generating associated blocks.
<br />
This tool uses a combinatorial approach to generate possible configurations that will lead to a valid starting block. The first valid block encountered is used to generate the subsequent blocks, but even still this process is quite inefficient and will take an impossibly long time for large designs. Warnings are provided if the processing will take a long time.

Repeated values will be color coded as the same color for easy validation that the repetition number (r) is correct.

### Setup

```
npm install -g sbibd
```

### Usage
```
  Options:
	-V, --version      output the version number
	-v, --vVal <vVal>  The value for param v
	-r, --rVal <rVal>  The value for param r
	-l, --lVal <lVal>  The value for param λ
	-h, --help         output usage information
```
**Basic usage:**
```
sbibd -v 15 -r 7 -l 3
```

**Basic usage:**
```
sbibd -v 15 -r 7 -l 3
```

**Sample run:**
```
❯ sbibd -v 15 -r 7 -l 3
 0: {  0,   2,   5,   6,   8,   9,  10 }
 1: {  1,   3,   6,   7,   9,  10,  11 }
 2: {  2,   4,   7,   8,  10,  11,  12 }
 3: {  3,   5,   8,   9,  11,  12,  13 }
 4: {  4,   6,   9,  10,  12,  13,  14 }
 5: {  5,   7,  10,  11,  13,  14,   0 }
 6: {  6,   8,  11,  12,  14,   0,   1 }
 7: {  7,   9,  12,  13,   0,   1,   2 }
 8: {  8,  10,  13,  14,   1,   2,   3 }
 9: {  9,  11,  14,   0,   2,   3,   4 }
10: { 10,  12,   0,   1,   3,   4,   5 }
11: { 11,  13,   1,   2,   4,   5,   6 }
12: { 12,  14,   2,   3,   5,   6,   7 }
13: { 13,   0,   3,   4,   6,   7,   8 }
14: { 14,   1,   4,   5,   7,   8,   9 }
```

### Mathematics
Basic validation is performed to eliminate the need to wait for costly runs of the algorithm if the configuration is valid.

While this program only works for symmetric balanced incomplete block designs, the necessary conditions for the existence a (<em>v</em>, <em>b</em>, <em>r</em>, <em>k</em>, λ)-BIBD are checked first:
```
λ(v - 1) = r(k - 1)
```
In semetric designs, `v = b` and `r = k`, so this becomes `λ(v - 1) = r(r - 1)`

Second validation is a partial check of the <em>Bruck-Ryser-Chowla</em> theorem, ensuring that the paramaters satisfy the following:
```
if there exists an SBIBD with parameters (v, k, λ), then if v is even, k - λ is a square
```

