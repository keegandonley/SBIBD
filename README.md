
<div align="center">

## SBIBD
[![forthebadge](https://forthebadge.com/images/badges/built-with-science.svg)](https://forthebadge.com)

</div>

Simple CLI for validating SBIBD configurations and generating associated blocks.
<br />
This tool uses a combinatorial approach to generate possible configurations that will lead to a valid starting block. The first valid block encountered is used to generate the subsequent blocks, but even still this process is quite inefficient and will take an impossibly long time for large designs. Warnings are provided if the processing will take a long time.

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
