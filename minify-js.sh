for file in public-deploy/scripts/*.js; do
    squash "$file" > "$file"+.temp
    thanos = $file
    cp ${thanos}.temp $file
    rm ${thanos}.temp 
    echo minified: "$file" 
done 
