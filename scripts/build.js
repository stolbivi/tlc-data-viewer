const fsExtra = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));

const paths = {
    dist: 'public',
    public: 'static',
};

function init() {
    console.log('Init for:', paths.dist);
    fsExtra.emptyDirSync(paths.dist);
    fsExtra.copySync(paths.public, paths.dist, {
        dereference: true,
        filter: file => !file.includes('.html'),
    });
}

switch (args['command']) {
    case 'init':
        init();
        break;
}

module.exports = paths;
