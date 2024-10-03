import { hex2rgb, deg2rad } from './js/utils/utils.js'

/**
 * @Class
 * Base class for all drawable shapes
 * 
 */
class Shape
{
    /**
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Shader} shader The shader to be used to draw the object
     * @param {Array<Float>} vertices List of vertex positions
     * @param {Array<Int>} indices List of vertex indices
     * @param {Array<Float>} color Color as a three-element vector
     * @param {WebGL2RenderingContext.GL_TRIANGLES | WebGL2RenderingContext.GL_POINTS} draw_mode The draw mode to use. In this assignment we use GL_TRIANGLES and GL_POINTS
     * @param {Number} num_elements The number of elements that make up one primitive in the given draw mode
     */
    constructor( gl, shader, vertices, indices, color, draw_mode, num_elements )
    {
        this.shader = shader

        this.vertices = vertices
        this.vertices_buffer = null
        this.createVBO( gl )

        this.indices = indices
        this.index_buffer = null
        this.createIBO( gl )

        this.color = color

        this.draw_mode = draw_mode

        this.num_components = 2
        this.num_elements = num_elements

        this.vertex_array_object = null
        this.createVAO( gl, shader )
    }

    /**
     * Sets up a vertex attribute object that is used during rendering to automatically tell WebGL how to access our buffers
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createVAO( gl, shader )
    {
        //throw '"Shape.createVAO" not implemented'

        // TODO: Create a vertex attribute object (VAO) and store it in 'this.vertex_array_object'
	this.vertex_array_object = gl.createVertexArray();
        gl.bindVertexArray(this.vertex_array_object);
        // TODO: Bind the VBO and link it to the shader attribute 'a_position'
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
        gl.enableVertexAttribArray(shader.a_position);
        // TODO: Set the correct vertex attrib pointer settings for your VBO, so that the vertex data is mapped correctly to 'a_position'
	gl.vertexAttribPointer(shader.a_position, this.num_components, gl.FLOAT, false, 0, 0);
        // TODO: Unbind buffers and clean up
	gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * Creates vertex buffer object for vertex data
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createVBO( gl )
    {
        //throw '"Shape.createVBO" not implemented'

        // TODO: Create a vertex buffer (VBO) and store it in 'this.vertices_buffer'
	this.vertices_buffer = gl.createBuffer();
        // TODO: Fill the buffer with data in 'this.vertices'
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
        // TODO: Pay attention to the data type of the buffer and refer to the book
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }

    /**
     * Creates index buffer object for vertex data
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createIBO( gl )
    {
        //throw '"Shape.createIBO" not implemented'

        // TODO: Create an index buffer object (IBO) and store it in 'this.index_buffer'
	this.index_buffer = gl.createBuffer();
        // TODO: Fill the buffer with data in 'this.indices'
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        // TODO: Pay attention to the datatype of the buffer and refer to the book
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    /**
     * Render call for an individual shape.
     * 
     * In this function, you set both the vertex and index buffers active
     * After that you want to set the color uniform "u_color" in the shader, so that it knows which color to use
     * "u_color" is a vec3 i.e. a list of 3 floats
     * Finally, you draw the geometry
     * Don't forget to unbind the buffers after that
     * 
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    render( gl )
    {
        //throw '"Shape.render" not implemented'

        // TODO: Bind vertex array object
	gl.bindVertexArray(this.vertex_array_object);
        // TODO: Bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        // TODO: Send uniform attributes for the shape's color using 'this.shader' and its function 'setUniform3f'
        // TODO: The color is stored in 'this.color' and needs to be passed to the uniform named 'u_color' in the shader
	this.shader.setUniform3f("u_color", this.color);
        // TODO: Draw the element
	gl.drawElements(this.draw_mode, this.num_elements, gl.UNSIGNED_SHORT, 0);
        // TODO: Clean Up
	gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

}

/**
 * @Class
 * Triangle extension for Shape. Creates vertex list and indices and calls the super constructor.
 */
class Triangle extends Shape
{

    constructor( gl, shader, position, color, sideLength) 
    {
        //throw '"Triangle" constructor not implemented'

        // You will need those angles to define your triangle vertices
        let cosangle = Math.cos(deg2rad(30))
        let sinangle = Math.sin(deg2rad(30))

        // TODO: Create a list of vertices defining the triangle
        let vertices = [
            position[0], position[1] - sideLength / (2*cosangle),
            position[0] - sideLength / 2, position[1] + sideLength*sinangle/(2*cosangle),
            position[0] + sideLength / 2, position[1] + sideLength*sinangle/(2*cosangle)
        ]

        // TODO: Create a list of indices referencing the triangle vertices in order
        let indices = [
            0,1,2
        ]

        // TODO: Check out the 'Shape' class and understand what the constructor does
        super( gl, shader, vertices, indices, color, gl.TRIANGLES, indices.length )

    }

}

/**
 * @Class
 * WebGlApp that will call basic GL functions, manage a list of shapes, and take care of rendering them
 * 
 * This class will use the Shapes that you have implemented to store and render them
 */
class WebGlApp 
{
    /**
     * Initializes an empty list of shapes. Use this to store shapes.
     */
    constructor()
    {
        this.shapes = [ ]
    }

    /**
     * Initializes webgl2 with settings
     * @returns { WebGL2RenderingContext | null } The WebGL2 context or Null
     */
    initGl( )
    {
        //throw '"WebGLApp.initGL" not implemented'
	let canvas = document.getElementById("canvas");
        // TODO: Get the canvas element and retrieve its webgl2 context 
	let gl = canvas.getContext("webgl2");
        // TODO: Return the context
        return gl;
    }

    /**
     * Sets the viewport of the canvas to fill the whole available space so we draw to the whole canvas
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Number} width 
     * @param {Number} height 
     */
    setViewport( gl, width, height )
    {
        //throw '"WebGLApp.setViewport" not implemented'

        // TODO: Set the GL viewport to fill the full width and height of the canvas
	gl.viewport(0, 0, width, height);
    }

    /**
     * Clears the canvas color with Aggie Blue
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     */
    clearCanvas( gl )
    {
        //throw '"WebGlApp.clearCanvas" not implemented'

        // TODO: Clear the canvas with Aggie Blue (#022851) 
        // TODO: Check out the helper function 'hex2rgb'
	const aggieBlue = hex2rgb("#022851");
        gl.clearColor(aggieBlue[0], aggieBlue[1], aggieBlue[2], 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Adds a triangle shape to the list of shapes
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Shader} shader The shader to be used to draw the object
     * @param {Array<Number>} position The position of the point as a two-element array
     * @param {Number} sideLength The length of the triangle sides
     */
    addTriangle( gl, shader, position, sideLength )
    {
        //throw '"WebGlApp.addTriangle" not implemented'

        const aggieGold = hex2rgb("#FFBF00");
	let triangle = new Triangle(gl, shader, position, aggieGold, sideLength);
	this.shapes.push(triangle);
    }

    /**
     * Clears the list of shapes. After this call the canvas will be empty.
     */
    clearShapes()
    {
        this.shapes = [ ]
    }

    /**
     * Main render loop which sets up the active viewport (i.e. the area of the canvas we draw to)
     * clears the canvas with a background color and draws all active shapes
     * 
     * If there's no shapes, only the background will be drawn
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Number} canvas_width The canvas width. Needed to set the viewport
     * @param {Number} canvas_height The canvas height. Needed to set the viewport
     */
    render( gl, canvas_width, canvas_height )
    {
        //throw '"WebGlApp.render" not implemented'

        // TODO: Set the viewport to span the full 'canvas_width' and 'canvas_height' using the function you implemented above
	this.setViewport(gl, canvas_width, canvas_height);
        // TODO: Clear the active viewport with Aggie Blue using the function you implemented above
	this.clearCanvas(gl);
        // TODO: Loop through all shapes and render them using the Shape's render function
	for (let shape of this.shapes) {
            shape.render(gl);
        }
    }

}


// JS Module Export -- No need to modify this
export
{
    Triangle,
    WebGlApp
}
