# oj-frontend

openapi --input http://localhost:8101/api/judge/v2/api-docs --output ./generated/judge --client axios

openapi --input http://localhost:8101/api/user/v2/api-docs --output ./generated/user --client axios

openapi --input http://localhost:8101/api/question/v2/api-docs --output ./generated/question --client axios


然后去到对应的文件夹中，将url前缀删除

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
