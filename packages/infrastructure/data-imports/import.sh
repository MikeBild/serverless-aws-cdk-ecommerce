TABLE=$1
FILE=$2

npx jdp $TABLE ./$FILE --beautify --output ./tmp.json
aws dynamodb batch-write-item --return-consumed-capacity TOTAL --request-items file://./tmp.json
rm ./tmp.json