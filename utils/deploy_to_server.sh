#!/usr/bin/env bash
root_path="/Users/AChien/crypto/bitshares/graphene-ui"

cd "$root_path/web";

for branch in cr1 cr2; do
  git checkout $branch
  npm run-script build

  echo "UPDATE ASSET_VERSION"
  cd "$root_path/web/dist"
  version=`date -u "+%Y%m%d%H%M%S"`
  sed -ie "s/ASSET_VERSION/$version/g" ./index.html

  echo "UPLOAD ASSET: WEBSERVER"
  cd "$root_path/web/dist"
  for file in *.js *.css *.dat; do
    gzip < $file > $file.gz
  done

  if [[ -f ./version ]]; then
    rm ./version
  fi

  find ./ -type f -print0 | sort -z | xargs -0 shasum | shasum | cut -d' ' -f1 > ./version

  # upload assets
  ssh runner@$branch "mkdir -p ~/data/www/releases/$version"
  scp ./* runner@$branch:~/data/www/releases/$version/
  # update symlink
  ssh runner@$branch "rm -f ~/data/www/current; ln -s ~/data/www/releases/$version ~/data/www/current"
done

exit 0





# cr1


# cr2
# upload assets
ssh runner@cr2 "mkdir -p ~/data/www/releases/$version"
scp ./* runner@cr2:~/data/www/releases/$version/
# update symlink
ssh runner@cr2 "rm -f ~/data/www/current; ln -s ~/data/www/releases/$version ~/data/www/current"
