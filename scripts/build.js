const fsExtra = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));
const {zip} = require('zip-a-folder');

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

function formatDate(date) {
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    return (`${ye}-${mo}-${da}`);
}

async function pack() {
    let pathToZip = `${paths.dist}_${formatDate(new Date())}.zip`;
    console.log('Packing:', paths.dist, 'to:', pathToZip);
    await zip(paths.dist, pathToZip);
}

switch (args['command']) {
    case 'init':
        init();
        break;
    case 'pack':
        pack();
        break;
}

module.exports = paths;
