for f in *_reinstall.up; do
	if [ ! -d $(basename $f _reinstall.up) ]
	then
		mkdir $(basename $f _reinstall.up)
		unzip -P 5X/9vAVhovyU2ygK -p $f rootfs1upd/e0000000001.dat.gz | tar -zxv -k -C  "$(basename $f _reinstall.up)"  "./jci/gui/*"
		sed '/<body>/a\
		<script src="../../../boot.js" type="text/javascript"></script>' cmu150_NA_55.00.753A/jci/gui/index.html > tmp.txt
		mv tmp.txt cmu150_NA_55.00.753A/jci/gui/index.html	
	fi
done
