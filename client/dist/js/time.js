// The MIT License (MIT)

// Copyright (c) 2013 Andy Hamlton

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var time_ago_in_words = function (ts, just_now) {
  var from, to, difference, periods, lengths, tense, i, period

  just_now = (typeof just_now != 'undefined') ? just_now : true

  from = new Date(ts)
  to   = new Date()

  difference = Math.abs(to - from) / 1000

  periods = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
  lengths = [60, 60, 24, 7, 4.35, 12]

  tense   = 'ago'

  if (difference < 60 && just_now)
    return (difference > 30) ? '1 minute ago' : 'Just now'

  for (i = 0; difference >= lengths[i] && i < lengths.length; i++) {
    difference /= lengths[i]
  }

  difference = Math.round(difference)

  period = (difference !== 1) ? periods[i] + 's' : periods[i]

  return [difference, period, tense].join(' ')
}
