Hi

THese are the following steps taken to complete the tasks.

step:
1> read big.tct from http://norvig.com/big.txt 
2> split words by spaces into an array
3> remove stop words which are not useful
4> Map modified array by value (liketranspose)
5> sort by count and trim the list to Top 10 words having most occurrences in the txt
6> Loop every word from 10 words and call an api https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=apikey&lang=en-en&text=dynamic_text'
7> read pos and synonym from api response.
8> Output json format having Word,Count,POS,synonym
9> Output os saved in output_file.json appears in the folder after execution.

Note: 
1> synonym is not a response from given api call so not included in there but can be added with two lines of code
2> reading big.txt from htttps takes time so have saved the same file inside worknig folder
    comment line 14-15-16-17-18-123-124 and run the code > node index.js
    