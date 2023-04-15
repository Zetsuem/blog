const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoryController')
const articleController = require('./articles/ArticleController')

// models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

//view engine
app.set("view engine", "ejs")

// Static
app.use(express.static('public'))

// Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database
connection
        .authenticate()
        .then(() => {
            console.log("Autenticação completa")
        }).catch((error) => {
            console.log('erro no database', error)
        })

app.use("/", categoriesController)
app.use("/", articleController)

app.get("/", (req, res) =>{
    Article.findAll({
        order:[[
            'id',
            'DESC'
        ]]
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        })
    })

})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            res.render("article", {article: articles, categories: categorias})
        } else {
            res.redirect('/')
        }
        }).catch(error => {
            res.redirect('/')
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category =>{
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.Articles, categories: categories})
                //console.log(category.Articles)
            })


        }else{ // caso a categoria seja nula
            res.redirect('/')
        }
    }).catch(err => { // Caso aconteça algum erro
        res.redirect('/')
    })
})

app.listen(8080,  () => {
    console.log("O servidor  está ativo")
})