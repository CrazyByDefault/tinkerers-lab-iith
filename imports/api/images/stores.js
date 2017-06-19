import { UploadFS } from 'meteor/jalik:ufs';
import { Images, Thumbs } from './collection';
 
export const ThumbsStore = new UploadFS.store.Local({
    collection: Thumbs,
    name: 'thumbs',
    path: '/uploads/photos',
    mode: '0744',
    writeMode: '0744',
    transformWrite(from, to, fileId, file) {
        // Resize to 64x64
        const gm = require('gm');

        gm(from, file.name)
            .resize(64, 64)
            .gravity('Center')
            .extent(64, 64)
            .quality(75)
            .stream()
            .pipe(to);
    }
});

export const ImagesStore = new UploadFS.store.Local({
    collection: Images,
    name: 'images',
    path: '/uploads/photos',
    mode: '0744',
    writeMode: '0744',
    filter: new UploadFS.Filter({
        contentTypes: ['image/*']
    }),
    copyTo: [
        ThumbsStore
    ]
});