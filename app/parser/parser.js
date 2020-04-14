module.exports = function () {
  var tress = require("tress");
  var request = require("request");
  var cheerio = require("cheerio");
  var resolve = require("url").resolve;
  var fs = require("fs");
  const ObjectId = require("mongodb").ObjectId;

  var URL = "https://tehnocentr.ru/catalog/matricy-v-sbore_47.html";
  var results = [];
  const links = [];
  let numberForCallImage = 1;

  // Function for download images
  const downloadImage = (uri, filename, callback) => {
    request.head(uri, function (err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
    });
  };

  const getImagesArrays = (urls) => {
    const result = [];
    for (const url of urls) {
      console.log(url);
      let name = `image-${numberForCallImage}`;
      downloadImage(url, `./data/images/${name}.png`, function () {
        console.log("done");
      });
      result.push({ filename: name });
      numberForCallImage += 1;
    }
    return result;
  };

  var q = tress(function (url, callback) {
    request(url, function (err, res) {
      if (err) throw err;

      // парсим DOM
      var $ = cheerio.load(res.body);

      //информация о новости
      const title = $(".product_full_name").text();
      if (
        !results.includes(title) &&
        title !== "" &&
        title !== " Отвертка универсальная (31 в 1)"
      ) {
        results.push({
          name: title,
          regular_price: Number(
            $(".regular_price")
              .text()
              .replace(/\s+/g, "")
              .slice(0, $(".regular_price").text().indexOf("р") - 2)
          ),
          category_id: new ObjectId("5e2855a6c8d0592360407000"),
          meta_description: title,
          stock: $(".button_add_to_cart").text(),
          meta_title: title,
          description: Array.from(
            $(".full_product_description>p").map(function () {
              return $(this).text();
            })
          ),
          attributes: Array.from(
            $(".tbl_characteristics>.trow").map(function () {
              return $(this).text().trim();
            })
          ).map((elem) => {
            const arr = elem.split(": ");
            return {
              name: arr[0],
              value: arr[1],
            };
          }),
          images: getImagesArrays(
            Array.from(
              $(".galleryItem").map(function () {
                return resolve(URL, $(this).attr("href"));
              })
            )
          ),
        });
      }

      //список новостей
      $(".mt26>a").each(function () {
        let url = resolve(URL, $(this).attr("href"));
        console.log(url);
        if (!links.includes(url)) {
          q.push(url);
          links.push(url);
        }
      });

      //паджинатор
      $(".pages_list>div:not(.page_active)>a").each(function () {
        // не забываем привести относительный адрес ссылки к абсолютному
        let url = resolve(URL, $(this).attr("href"));
        console.log(url);
        if (!links.includes(url)) {
          q.push(url);
          links.push(url);
        }
      });

      callback();
    });
  }, 10); // запускаем 10 параллельных потоков

  q.drain = function () {
    fs.writeFileSync("./data.json", JSON.stringify(results, null, 4));
  };

  q.push(URL);
};
