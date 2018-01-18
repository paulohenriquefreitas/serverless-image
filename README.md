# README #

# serverless-image
Projeto para analise de imagens.

# Extract Data

A ação de deployar uma imagem no S3 da Aws irá disparar uma trigger e persistir informações 
da foto no Dynamo Database.

# Get Image Metadata

O serviço de API da AWS disponibiliza um endpoint que responde as característica da imagem 
passada como parâmetro de URL.
EX: https://crsr91vi7e.execute-api.us-east-1.amazonaws.com/dev/images/image01.jpg 

# Get Image

Outro endpoint retorna a image hospedada no bucket do S3.
https://crsr91vi7e.execute-api.us-east-1.amazonaws.com/dev/images/download/L_AY_01.jpg