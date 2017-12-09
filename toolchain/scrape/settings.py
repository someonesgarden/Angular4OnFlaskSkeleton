import os
from os import path
BASE_DIR = path.realpath(path.dirname(__file__))
LOG_DIR = path.join(BASE_DIR, 'logs')

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)

LOGGING_CONF = {
    'version':1,
    'disable_existing_loggers':True,
    'formatters':{
        'default':{
            '()': 'colorlog.ColoredFormatter',
            'format':'\t'.join([
                "%(log_color)s[%(levelname)s]",
                "asctime:%(asctime)s",
                "process:%(process)d",
                "thread:%(thread)d",
                "module:%(module)s",
                "%(pathname)s:%(lineno)d",
                "message:%(message)s",
            ]),
            'datefmt':"%Y-%m-%d %H:%M:%S",
            'log_colors':{
                'DEBUG':'bold_black',
                'INFO':'white',
                'WARNING':'yellow',
                'ERROR':'red',
                'CRITICAL':'bold_red'
            },
        },

    }
}