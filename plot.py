import matplotlib.pyplot as plt
import json
import sys


if len(sys.argv) < 3:
    print('This script takes metric name and pairs of labels and filenames as arguments.')
    print('Example:\n\tpython ./plot.py latency \'Chrome HLS\' chrome_hls_log.json \'Firefox DASH\' firefox_dash_log.json')

metric = sys.argv[1]

browsers = []
for i in range(2, len(sys.argv) - 1, 2):
    browsers.append((sys.argv[i], sys.argv[i + 1]))


for browser, path in browsers:
    data = []
    with open(path) as json_data:
        data = json.load(json_data)

    metrics = []
    timestamps = []
    for log in data:
        if log['event'] == 'frag_loaded':
            data = log['data']
            metrics.append(data[metric])
            timestamps.append(log['timestamp'] / 1000)

    plt.plot(timestamps, metrics, label=browser)

plt.xlabel('time (s)')
plt.ylabel(metric + ' (ms)')
plt.legend(loc='best')
plt.show()
