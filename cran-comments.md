## Test environments
* local R installation, R 4.1.2
* ubuntu 16.04 (on travis-ci), R 4.1.2
* win-builder (devel)

## R CMD check results

0 errors | 0 warnings | 1 note

* This is a new release.

## Alterations upon resubmission
Converted title to title case:  
'WebGL'-Based 3D Plotting using the 'three.js' Library

Added single quotes to software references in title and description.

Removed unnecessary additional braces for '\concept{{plot components}}' in documentation

## Alterations upon resubmission 2
JavaScript additionally quoted to become 'JavaScript' in package description

Added \value Rd tags for all function documentation.

Tests now write to tempdir() and not to the users home filespace.

## Version 0.0.2
Ellipsis argument added to `as.tags.data3js` in order to match the generic `as.tags` 
arguments, in order to address a new CRAN check failure.

## Alterations upon resubmission
Date field updated
