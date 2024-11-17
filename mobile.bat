call cls
call echo Compilando...
call npm install
call npm run build

call echo Copiando...
call rd /s /q .\mobile\www\
call xcopy .\build\ .\mobile\www\ /e /i /h

call set JAVA_HOME=C:\Users\surface\ANDROID STUDIO\jbr
call set PATH=%PATH%;%JAVA_HOME%\bin

call set GRADLE_HOME=C:\Users\surface\.gradle\wrapper\dists\gradle-8.7-bin\bhs2wmbdwecv87pi65oeuq5iu\gradle-8.7\bin
call set PATH=%PATH%;%GRADLE_HOME%

call set ANDROID_HOME=C:\Users\surface\AppData\Local\Android\Sdk

call echo Ejecutando...
call cd .\mobile\
call cordova prepare
call cordova run android & cd ..