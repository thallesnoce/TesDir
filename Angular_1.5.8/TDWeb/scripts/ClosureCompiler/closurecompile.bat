@ECHO OFF  

SET DirSolution="C:\DevLeks\TesouroDireto\TDWeb"
SET InputFile=%DirSolution%\App_Scripts\script.js
SET OutputFile=%DirSolution%\App_Scripts\geraljs.js

@ECHO *********************************************
@ECHO Google Closure Compiler with jQuery Support   
@ECHO Compiling : '%InputFile%'  
@ECHO *********************************************
rem --compilation_level 
rem WHITESPACE_ONLY
rem SIMPLE_OPTIMIZATIONS
rem ADVANCED_OPTIMIZATIONS

CALL "C:\Program Files\Java\jre1.8.0_91\bin\java.exe" -jar %DirSolution%\scripts\ClosureCompiler\closure-compiler-v20161024.jar --js %InputFile% --js_output_file %OutputFile% --compilation_level SIMPLE_OPTIMIZATIONS --summary_detail_level 3 --warning_level QUIET
rem --externs D:\DevLeks\TesouroDiretoTempoReal\TDWeb\scripts\ClosureCompiler\jquery.js
rem --angular_pass

@ECHO *********************************************
@ECHO Build Complete
@ECHO *********************************************