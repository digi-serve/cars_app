#!/bin/bash
ID_Service=`docker ps | grep 'test_ab-v2-dev_db' | awk '{ print $1 }'`
if [ -z "$ID_Service" ]
then
	echo ""
	echo "couldn't find process matching '$ID_Service' "
	echo ""
	echo "current processes :"
	docker ps
	echo ""
else
	DB_Init=`cat ./cypress/integration/test_cars/test_setup/sql/db_init.sql`
	docker exec $ID_Service bash -c "echo '$DB_Init' > ./cars_db_init.sql"
	docker exec $ID_Service bash -c 'mysql -u root -proot "appbuilder-admin" < ./cars_db_init.sql'
fi