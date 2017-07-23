jq ".rows[].value += 1" school.json > sc.json
mv sc.json school.json
exit
