import { useEffect, useState} from 'react'

const PREFIX = 'code-clone-'

export default function useLocalStorage(key, initialValue) {
    const prefixedkey = PREFIX + key

    const [value, setValue] = useState(() => {
        const jsonvalue = localStorage.getItem(prefixedkey)
        if (jsonvalue != null) return JSON.parse(jsonvalue)

        if (typeof initialValue === 'function') {
            return initialValue()
        } else {
            return initialValue
        }
    })

    useEffect(() => {
        localStorage.setItem(prefixedkey, JSON.stringify(value))
    }, [prefixedkey, value])



  return [value, setValue]
    
  
}
