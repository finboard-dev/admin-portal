import React from 'react';
import { Typography, Box, Divider, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MarkdownRendererProps {
  content: string;
}

const StyledCodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const StyledInlineCode = styled('code')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.875rem',
  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    while (currentIndex < lines.length) {
      const line = lines[currentIndex];
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <Typography key={currentIndex} variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            {line.substring(2)}
          </Typography>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Typography key={currentIndex} variant="h5" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            {line.substring(3)}
          </Typography>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <Typography key={currentIndex} variant="h6" component="h3" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            {line.substring(4)}
          </Typography>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <Typography key={currentIndex} variant="subtitle1" component="h4" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            {line.substring(5)}
          </Typography>
        );
      } else if (line.startsWith('##### ')) {
        elements.push(
          <Typography key={currentIndex} variant="subtitle2" component="h5" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            {line.substring(6)}
          </Typography>
        );
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        currentIndex++;
        while (currentIndex < lines.length && !lines[currentIndex].startsWith('```')) {
          codeLines.push(lines[currentIndex]);
          currentIndex++;
        }
        elements.push(
          <StyledCodeBlock key={currentIndex}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {codeLines.join('\n')}
            </pre>
          </StyledCodeBlock>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<Divider key={currentIndex} sx={{ my: 2 }} />);
      }
      // Unordered lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: string[] = [];
        while (currentIndex < lines.length && (lines[currentIndex].startsWith('- ') || lines[currentIndex].startsWith('* '))) {
          listItems.push(lines[currentIndex].substring(2));
          currentIndex++;
        }
        currentIndex--; // Adjust for the extra increment
        elements.push(
          <List key={currentIndex} dense sx={{ pl: 2 }}>
            {listItems.map((item, idx) => (
              <ListItem key={idx} sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <Typography variant="body1">{parseInlineMarkdown(item)}</Typography>
              </ListItem>
            ))}
          </List>
        );
      }
      // Ordered lists
      else if (/^\d+\. /.test(line)) {
        const listItems: string[] = [];
        while (currentIndex < lines.length && /^\d+\. /.test(lines[currentIndex])) {
          listItems.push(lines[currentIndex].replace(/^\d+\. /, ''));
          currentIndex++;
        }
        currentIndex--; // Adjust for the extra increment
        elements.push(
          <List key={currentIndex} dense sx={{ pl: 2 }}>
            {listItems.map((item, idx) => (
              <ListItem key={idx} sx={{ display: 'list-item', listStyleType: 'decimal', pl: 0 }}>
                <Typography variant="body1">{parseInlineMarkdown(item)}</Typography>
              </ListItem>
            ))}
          </List>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<Box key={currentIndex} sx={{ height: 8 }} />);
      }
      // Regular paragraphs
      else {
        elements.push(
          <Typography key={currentIndex} variant="body1" paragraph>
            {parseInlineMarkdown(line)}
          </Typography>
        );
      }
      
      currentIndex++;
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Handle inline code
    const codeRegex = /`([^`]+)`/g;
    const parts = text.split(codeRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <StyledInlineCode key={index}>{part}</StyledInlineCode>;
      }
      
      // Handle bold text
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const boldParts = part.split(boldRegex);
      
      return boldParts.map((boldPart, boldIndex) => {
        if (boldIndex % 2 === 1) {
          return <strong key={`${index}-${boldIndex}`}>{boldPart}</strong>;
        }
        
        // Handle italic text
        const italicRegex = /\*([^*]+)\*/g;
        const italicParts = boldPart.split(italicRegex);
        
        return italicParts.map((italicPart, italicIndex) => {
          if (italicIndex % 2 === 1) {
            return <em key={`${index}-${boldIndex}-${italicIndex}`}>{italicPart}</em>;
          }
          return italicPart;
        });
      });
    });
  };

  return (
    <Box sx={{ 
      '& > *:first-of-type': { mt: 0 },
      lineHeight: 1.6 
    }}>
      {parseMarkdown(content)}
    </Box>
  );
};

export default MarkdownRenderer;