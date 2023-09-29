
export const hexToRgb = (hex) => ({
    red: parseFloat(parseInt(hex.substr(1,2), 16)/255).toFixed(4),
    green: parseFloat(parseInt(hex.substr(3,2), 16)/255).toFixed(4),
    blue: parseFloat(parseInt(hex.substr(5,2), 16)/255).toFixed(4),
})

export const hexToXy = (hex) => {
    const rgb = hexToRgb(hex)
    // console.log(rgb)
    const red = parseFloat((parseFloat(rgb.red) > 0.04045) ? Math.pow((parseFloat(rgb.red) + 0.055) / (1.0 + 0.055), 2.4) : (parseFloat(rgb.red) / 12.92))
    const green = parseFloat((parseFloat(rgb.green) > 0.04045) ? Math.pow((parseFloat(rgb.green) + 0.055) / (1.0 + 0.055), 2.4) : (parseFloat(rgb.green) / 12.92))
    const blue = parseFloat((parseFloat(rgb.blue) > 0.04045) ? Math.pow((parseFloat(rgb.blue) + 0.055) / (1.0 + 0.055), 2.4) : (parseFloat(rgb.blue) / 12.92))

    // console.log(red, green, blue)

    const X = parseFloat(parseFloat(red) * 0.4124 + parseFloat(green) * 0.3576 + parseFloat(blue) * 0.1805);
    const Y = parseFloat(parseFloat(red) * 0.2126 + parseFloat(green) * 0.7152 + parseFloat(blue) * 0.0722);
    const Z = parseFloat(parseFloat(red) * 0.0193 + parseFloat(green) * 0.1192 + parseFloat(blue) * 0.9505);

    return([
        parseFloat(parseFloat(X / (X + Y + Z)).toFixed(4)),
        parseFloat(parseFloat(Y / (X + Y + Z)).toFixed(4))
    ])
}