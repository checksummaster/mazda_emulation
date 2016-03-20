BASE=$(dirname $(greadlink -f $0))

for f in *_reinstall.up; do
	if [ ! -d $(basename $f _reinstall.up) ]
	then
		mkdir $(basename $f _reinstall.up)
		unzip -P 5X/9vAVhovyU2ygK -p $f rootfs1upd/e0000000001.dat.gz | tar -zxv -k -C  "$(basename $f _reinstall.up)"  "./jci/gui/*"
		sed '/<body>/a\
		<script src="../../../boot.js" type="text/javascript"></script><script src="apps/_custom/additionalApps.js" type="text/javascript"></script><script src="../../../sdcard/CustomApplicationsProxy.js" type="text/javascript"></script>' $(basename $f _reinstall.up)/jci/gui/index.html > tmp.txt
		mv tmp.txt $(basename $f _reinstall.up)/jci/gui/index.html	
		ln -sf ${BASE}/apps $(basename $f _reinstall.up)/jci/gui/apps/_custom
		mkdir -p $(basename $f _reinstall.up)/jci/gui/apps/custom
		ln -sf ${BASE}/sdcard/system/js $(basename $f _reinstall.up)/jci/gui/apps/custom/js 
		ln -sf ${BASE}/sdcard/system/css $(basename $f _reinstall.up)/jci/gui/apps/custom/css
		ln -sf ${BASE}/sdcard/system/templates $(basename $f _reinstall.up)/jci/gui/apps/custom/templates
		ln -sf ${BASE}/sdcard/system/runtime $(basename $f _reinstall.up)/jci/gui/apps/custom/runtime
		ln -sf ${BASE}/sdcard/apps $(basename $f _reinstall.up)/jci/gui/apps/custom/apps
	fi
done
