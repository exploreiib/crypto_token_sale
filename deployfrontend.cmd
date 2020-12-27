xcopy /s /y D:\BlockchainProjects\crypto_token_sale\src\ D:\BlockchainProjects\crypto_token_sale\docs\
xcopy /s /y D:\BlockchainProjects\crypto_token_sale\build\contracts\* D:\BlockchainProjects\crypto_token_sale\docs\
git add .
git commit -m "Compile assets for Github pages"
git push -u origin master

