#!/bin/bash
Module="cars"
Folder=$1
for Command in "$@"; do
    case $Command in
        import-files | reset)
            ID_Container_FILE_PROCESSOR=`docker ps | grep "test_" | grep "_file_processor" | awk '{ print $1 }'`
            ID_Container_DB=`docker ps | grep "test_" | grep "_db" | awk '{ print $1 }'`
            if [ -z "$ID_Container_FILE_PROCESSOR" ] || [ -z "$ID_Container_DB" ]
            then
                echo ""
                echo "couldn't find process matching '$ID_Container_FILE_PROCESSOR' and '$ID_Container_DB'"
                echo ""
                echo "current processes :"
                docker ps
                echo ""
            else
                if [ "$Command" == "import-files" ]
                then
                    for file in ./cypress/integration/${Folder}/test_setup/files_import/*; do
                        fileSize=`ls -l $file | awk '{ print $5 }'`
                        fileBasename=`basename $file`
                        case ${fileBasename#*.} in
                            docx)
                                fileType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                ;;
                            *)
                                fileType="Unknown Type"
                                ;;
                        esac
                        docker exec $ID_Container_FILE_PROCESSOR bash -c "mkdir /data/$Module && mkdir /data/$Module/file_processor"
                        docker cp ./cypress/integration/${Folder}/test_setup/files_import/$fileBasename $ID_Container_FILE_PROCESSOR:/data/$Module/file_processor
                        SQLScript="`
                            `LOCK TABLES \`SITE_FILE\` WRITE; `
                            `INSERT INTO \`SITE_FILE\` (\`uuid\`, \`created_at\`, \`updated_at\`, \`pathFile\`, \`size\`, \`type\`) `
                                `VALUES (\"${fileBasename%.*}\", NOW(), NOW(), \"/data/$Module/file_processor/$fileBasename\", $fileSize, \"$fileType\"); `
                            `UNLOCK TABLES; `
                        `"
                        docker exec $ID_Container_DB bash -c "echo '$SQLScript' > ./sql/${Module}_file_$fileBasename.sql && mysql -u root -proot \"appbuilder-admin\" < ./sql/${Module}_file_$fileBasename.sql && rm ./sql/${Module}_file_$fileBasename.sql && exit"
                    done
                else
                    docker exec $ID_Container_FILE_PROCESSOR bash -c "rm -rf /data/$Module"
                    SQLScript=""
                    for file in ./cypress/integration/test_$Module/test_setup/files_import/*; do
                        SQLScript+="`
                            `LOCK TABLES \`SITE_FILE\` WRITE; `
                            `DELETE FROM \`SITE_FILE\` WHERE \`uuid\` = \"$(basename ${file%.*})\"; `
                            `UNLOCK TABLES; `
                        `"
                    done
                    docker exec $ID_Container_DB bash -c "echo '$SQLScript' >> ./sql/${Module}_file_reset.sql && mysql -u root -proot \"appbuilder-admin\" < ./sql/${Module}_file_reset.sql && rm ./sql/${Module}_file_reset.sql && exit"
                fi
            fi
            ;;
        *)
            echo "file-manager: no such command \"$Command\""
            ;;
    esac
done
