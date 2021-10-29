#!/bin/bash
ID_Service=$(docker ps | grep 'test_' | grep '_db' | awk '{ print $1 }')
for FILE_SQL in "$@"
do
	if [ -z "$ID_Service" ]
	then
		echo ""
		echo "couldn't find process matching '$ID_Service' "
		echo ""
		echo "current processes :"
		docker ps
		echo ""
	else
		DB_Init=$(cat ./cypress/integration/test_cars/test_setup/sql/$FILE_SQL)
		docker exec $ID_Service bash -c "echo '$DB_Init' > ./sql/cars_'$FILE_SQL'"
		docker exec $ID_Service bash -c "mysql -u root -proot \"appbuilder-admin\" < ./sql/cars_'$FILE_SQL'"
		docker exec $ID_Service bash -c "rm ./sql/cars_'$FILE_SQL'"
	fi
done
