import React from 'react'

/**
 * Interface for the props of the Paragraph component.
 * @interface
 * @property {string} id - The id of the paragraph.
 * @property {string} text - The text content of the paragraph.
 * @property {'left' | 'right' | 'center' | 'justify' | 'inherit'} textAlign - The text alignment of the paragraph. Defaults to 'justify'.
 */
interface ParagraphProps {
    id: string;
    text: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

/**
 * Paragraph component.
 * @param {ParagraphProps} props - The props for the component.
 * @returns {React.ReactElement} - A paragraph element with the passed id, text, and text alignment.
 */
export const Paragraph = ({ id, text, textAlign = 'justify' }: ParagraphProps): React.ReactElement => (
    <p id={ id } style={ { textAlign } }> { text } </p>
)