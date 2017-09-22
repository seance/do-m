/**
 * For multivalued algebraic types; "rewinds" the generator on re-entry to next
 * handler on multiple values.
 */
const doMReentrant = comprehension => {
  const next = vs => v => {
      const gen = comprehension()
      const nvs = vs.concat(v)
      const { done, value } = nvs.reduce(
          (_, v) => gen.next(v),
          {})

      return !done && value
          ? value.chain(next(nvs))
          : value
  }

  return next([])(undefined)
}

/**
 * For non-multivalued algebraic types, no rewinding necessary.
 */
const doMSimple = comprehension => {
    const gen = comprehension()
    const next = v => {
        const { done, value } = gen.next(v)
        return !done && value
            ? value.chain(next)
            : value
    }

    return next(undefined)
}

const doM = (comprehension, reentrant) =>
    reentrant
        ? doMReentrant(comprehension)
        : doMSimple(comprehension)

module.exports = {
    doM
}
