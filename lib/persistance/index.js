const level = require('level')
const config = require('./config.json')
const logger = require('^logger')

var db = level(config.dbDir)

// 2) put a key & value
db.put('name', 'Level', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // ta da!
    console.log('name=' + value)
  })
})




mongoose.connect(config.connectionString);

mongoose.connection.on('error', function(error){
    logger.fatal(error);
    process.exit(1);
});

mongoose.connection.once('open', function () {
  logger.info('Connected to db.');
});

var originalOptions = mongoose.Schema.prototype.defaultOptions;

mongoose.Schema.prototype.defaultOptions = function(options){
    if(!options){
        options = {};
    }

    if(!options.toJSON){
        options.toJSON = {};
    }

    options.toJSON.transform = function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    };

    return originalOptions.call(mongoose.Schema.prototype, options);
};

module.exports = {
    Account: require('./models/account'),
    Company: require('./models/company'),
    Record: require('./models/record'),
    Schema: require('./models/schema'),
    Translation: require('./models/translation'),
    View: require('./models/view'),
    mongoose: mongoose
};
