## `wildcat-babel`
Wrapper for babel that gives better logging and the ability to transpile files across multiple cpus.

## Options
### -x, --extensions [extensions]
List of extensions to compile when a directory has been input [.es6,.js,.es,.jsx]
### -w, --watch
Recompile files on changes
### --bin-dir [bin]
Compile binary files into a binary directory
### -d, --out-dir [out]
Compile an input directory of modules into an output directory
### -s, --source-dir [src]
Specify the target source directory
### -i, --ignore <patterns> 
RegExp pattern to ignore, patterns
### -D, --copy-files
When compiling a directory copy over non-compilable files
### -B, --binary-to-module
Convert non-compilable files to importable modules
### -M, --manifest [path]
Use a manifest to specify files to compile
### --minify
Minify output with UglifyJS
### --cpus <cpus>
Specify the number of CPUs to use for code transpilation
### -q, --quiet
Don't log anything