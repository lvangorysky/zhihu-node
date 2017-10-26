var https = require('https'),
    request = require('request'),
    cheerio = require('cheerio'),
    zhihu = require('zhihu');
    path = require('path'),
    fs = require('fs'),
    defaultUrl = 'https://www.zhihu.com/question/57626924'; // 发一张你认为很漂亮的美女照片
    url = process.argv[2];

let app = {
  init (url) {
    this.filePath = this.generateFilePath(this.parseFileName(url));
    this.getAllHtml(url, this.filterHtml);
  },
  getAllHtml (url, callback) {
    let sHtml = '',
        _this = this;
    https.get(url, (res) => {
      res.on('data', (data) => {
        sHtml  = sHtml + data;
        // console.log(sHtml)
      });
      res.on('end', () => {
        callback.bind(_this, sHtml)();
      })
    }).on('error', (err) => {
     
    });
  },
  filterHtml (sHtml, filePath) {
    console.log(sHtml)
    let $ = cheerio.load(sHtml),
        $Imgs = $('noscript img'),
        imgData = [],
        _this = this;
      
      // console.log($Imgs) 
      $Imgs.each((i, e) => {
        let imgUrl = $(e).attr('src');
        imgData.push(imgUrl);
        _this.downloadImg(imgUrl, _this.filePath, function (err) {
          // console.log(imgUrl + 'has be down');
        });
      });
  },
  parseFileName (fileName) {
    // console.log('fileName' + fileName);
    return path.basename(fileName);
  },
  generateFilePath (path) {
    if (fs.existsSync(path)) {
      console.log(path + '目录已经存在');
    } else {
      fs.mkdirSync(path);
      console.log(path + '目录创建成功');
    }
    return path;
  },
  downloadImg (imgUrl, filePath, callback) {
    let fileName = this.parseFileName(imgUrl);
    request(imgUrl).pipe(fs.createWriteStream('./' + filePath + '/'+fileName)).on('close', callback && callback);
  }
};
app.init(defaultUrl);

