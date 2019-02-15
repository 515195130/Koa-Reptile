const request = require('superagent') 
const cheerio = require('cheerio') 
const _resolve = require("url").resolve
const Koa = require('koa')

const app = new Koa
const url = 'https://www.zhipin.com/c101210100-p100901/'

app.use(async ctx => {
  const arr = []
  const data = await new Promise(resolve => {
              request  //向页面发起请求 这是异步的
                .get(url)
                .end((err, res) => {
                  const data = res.text
                  const $ = cheerio.load(data)
                  //把具备HTML结构的字符串转换成dom结构，查询节点用jQuery语法
                  $(".info-primary").each((i, v) => {
                    const $v = $(v)
                    const href = _resolve(url, $v.find("a").prop("href"))
                    //没办法，resolve和res前面用作形参名了，只能_resolve
                    const name = $v.find(".job-title").text()
                    const salary = $v.find(".red").text()
                    const obj = {
                      url:href,
                      title:name,
                      salary:salary,
                    }
                    arr.push(obj)
                  })
                  resolve(arr)
                })
    })
    ctx.body = data
  })

app.listen(3000)