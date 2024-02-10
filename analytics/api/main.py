import re
import random

import joblib
import contractions as cont
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup

app = FastAPI()
origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

def remove_repeat(text):
    newstr=''
    for word in str(text).split():
        if len(set(word))>1:
            newstr+=word+' '
    return newstr

def clean(text):
    cleaned_tweets = []
    for tweet in text:
        tweet=tweet.lower()
        tweet = re.sub('@\w*','',tweet)
        tweet = re.sub('http\S*','',tweet)
        tweet = re.sub('[0-9]','',tweet)
        tweet = re.sub(r"[',!%?/;:{}()\-\*\+\[\]\.\^]",'',tweet)
        tweet = BeautifulSoup(tweet,'lxml').get_text()
        tweet = cont.fix(tweet)
        tweet = remove_repeat(tweet)
        tweet = remove_emoji(tweet)

        if tweet is not None:
            cleaned_tweets.append(tweet)
    return cleaned_tweets

def remove_emoji(string):
    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map symbols
                               u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               u"\U00002500-\U00002BEF"  # chinese chars
                               u"\U00002702-\U000027B0"
                               u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               u"\U0001f926-\U0001f937"
                               u"\U00010000-\U0010ffff"
                               u"\u2640-\u2642"
                               u"\u2600-\u2B55"
                               u"\u200d"
                               u"\u23cf"
                               u"\u23e9"
                               u"\u231a"
                               u"\ufe0f"  # dingbats
                               u"\u3030"
                               "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', string)

def get_cleaned_tweets(hashtag: str):
    max_tweets = random.randrange(50,90)
    tweet_list = []
    resp = requests.get(url=f'https://api.pullpush.io/reddit/search/comment/?q={hashtag}&subreddit=nft&size={max_tweets}').json()
    for i, tweet in enumerate(resp['data']):
        if i>max_tweets:
            break
        tweet_list.append(tweet['body'])
    tweets = clean(tweet_list)
    return tweets

@app.get('/get_sentiment/{nft_name}')
async def get_sentiment(nft_name: str):
    reddit_predictor = joblib.load('reddit_classifier.pickle')
    cleaned_tweets = get_cleaned_tweets(nft_name)

    result = {}
    nPos = 0

    predictions = reddit_predictor.predict(cleaned_tweets)
    for val in predictions:
        if val==1:
            nPos +=1
    posPer = nPos/len(cleaned_tweets)
    result = {'positive': posPer}
    return result

