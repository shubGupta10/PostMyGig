import {Ratelimit} from '@upstash/ratelimit'
import redis from './redis'

const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(20, '60s'),
    analytics: true,
})

export default ratelimiter;