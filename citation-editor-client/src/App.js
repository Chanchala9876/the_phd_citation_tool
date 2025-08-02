import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Button, 
  Group, 
  Stack, 
  Text, 
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Select,
  ColorInput,
  Divider,
  Box
} from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import { 
  IconDownload, 
  IconFileText, 
  IconBookmark, 
  IconPalette,
  IconSettings,
  IconInfoCircle
} from '@tabler/icons-react';
import axios from 'axios';
import SuggestionDropdown from './SuggestionDropdown';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function App() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [showSettings, setShowSettings] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  const editorRef = useRef(null);
  const atPositionRef = useRef(null);

  // Fetch citation suggestions from API
  const fetchSuggestions = async (q) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/citation/search?q=${q}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err.message);
    }
  };

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === '@') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      atPositionRef.current = range.cloneRange();

      const rect = range.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      setShowSuggestions(true);
      setQuery('');
    } else if (showSuggestions && /^[a-zA-Z0-9 ]$/.test(e.key)) {
      setQuery((prev) => prev + e.key);
    } else if (e.key === ' ' && showSuggestions) {
      setShowSuggestions(false);
      setQuery('');
    } else if (e.key === 'Escape' && showSuggestions) {
      setShowSuggestions(false);
      setQuery('');
    }
  };

  // Fetch suggestions as query updates
  useEffect(() => {
    if (query.length > 1) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionSelect = (suggestion) => {
    const citation = `${suggestion.author} (${suggestion.title})`;
    
    const currentValue = value;
    const searchPattern = `@${query}`;
    const lastIndex = currentValue.lastIndexOf(searchPattern);
    
    if (lastIndex !== -1) {
      const newValue = currentValue.substring(0, lastIndex) + citation + ' ' + currentValue.substring(lastIndex + searchPattern.length);
      setValue(newValue);
      
      // Add success animation class to the editor
      const editorElement = editorRef.current?.querySelector('.mantine-RichTextEditor-content');
      if (editorElement) {
        editorElement.classList.add('success-animation');
        setTimeout(() => {
          editorElement.classList.remove('success-animation');
        }, 500);
      }
    }
    
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery('');
  };

  // Calculate word and character count
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  }, [value]);

  // Load saved document
  useEffect(() => {
    const saved = localStorage.getItem('document');
    const savedTitle = localStorage.getItem('documentTitle');
    if (saved) setValue(saved);
    if (savedTitle) setDocumentTitle(savedTitle);
  }, []);

  // Auto-save document
  useEffect(() => {
    localStorage.setItem('document', value);
    localStorage.setItem('documentTitle', documentTitle);
  }, [value, documentTitle]);

  // Save as Word document
  const handleSaveAsWord = async () => {
    try {
      // Create a temporary div to extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = value;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: documentTitle,
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: textContent,
                  size: 24,
                }),
              ],
            }),
          ],
        }],
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${documentTitle}.docx`);
    } catch (error) {
      console.error('Error saving Word document:', error);
    }
  };

  // Save as HTML
  const handleSaveAsHTML = () => {
    const blob = new Blob([value], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${documentTitle}.html`;
    a.click();
  };

  // Clear document
  const handleClearDocument = () => {
    setValue('');
    setDocumentTitle('Untitled Document');
  };

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Paper shadow="sm" p="md" mb="md" withBorder>
        <Group position="apart" align="center">
          <Group>
            <IconFileText size={32} color="#228be6" />
            <div>
              <Title order={2} color="dark.7">PhD Thesis Editor</Title>
              <Text size="sm" color="dimmed">Professional academic writing with smart citations</Text>
            </div>
          </Group>
          
          <Group>
            <Badge variant="light" color="blue">
              {wordCount} words
            </Badge>
            <Badge variant="light" color="gray">
              {charCount} characters
            </Badge>
            <Tooltip label="Settings">
              <ActionIcon 
                variant="light" 
                color="gray" 
                onClick={() => setShowSettings(true)}
              >
                <IconSettings size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Document Title */}
      <Paper shadow="sm" p="md" mb="md" withBorder>
        <TextInput
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          placeholder="Enter document title..."
          size="lg"
          styles={{
            input: {
              fontSize: '1.5rem',
              fontWeight: 600,
              border: 'none',
              backgroundColor: 'transparent',
              '&:focus': {
                border: '2px solid #228be6',
                backgroundColor: 'white'
              }
            }
          }}
        />
      </Paper>

      {/* Editor */}
      <Paper shadow="sm" withBorder>
        <div ref={editorRef}>
          <RichTextEditor
            value={value}
            onChange={setValue}
            style={{ 
              minHeight: '70vh',
              border: 'none',
              '& .mantine-RichTextEditor-root': {
                border: 'none'
              }
            }}
            controls={[
              ['bold', 'italic', 'underline', 'strike'],
              ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
              ['unorderedList', 'orderedList'],
              ['blockquote', 'codeBlock'],
              ['link', 'image'],
              ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
              ['fontFamily', 'fontSize', 'color'],
              ['superscript', 'subscript'],
              ['clean'],
            ]}
            onKeyDown={handleKeyDown}
            styles={{
              root: {
                border: 'none',
                '& .mantine-RichTextEditor-toolbar': {
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: '#f8f9fa'
                },
                '& .mantine-RichTextEditor-content': {
                  padding: '2rem',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }
              }
            }}
          />
        </div>
      </Paper>

      {/* Footer Actions */}
      <Paper shadow="sm" p="md" mt="md" withBorder>
        <Group position="apart">
          <Group>
            <Text size="sm" color="dimmed">
              💡 Tip: Type @ to insert citations
            </Text>
          </Group>
          
          <Group>
            <Button 
              variant="light" 
              color="red" 
              onClick={handleClearDocument}
              leftIcon={<IconBookmark size={16} />}
            >
              Clear Document
            </Button>
            <Button 
              variant="light" 
              color="gray" 
              onClick={handleSaveAsHTML}
              leftIcon={<IconDownload size={16} />}
            >
              Save as HTML
            </Button>
            <Button 
              color="blue" 
              onClick={handleSaveAsWord}
              leftIcon={<IconFileText size={16} />}
            >
              Save as Word
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Settings Modal */}
      <Modal
        opened={showSettings}
        onClose={() => setShowSettings(false)}
        title="Document Settings"
        size="md"
      >
        <Stack spacing="md">
          <TextInput
            label="Document Title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter document title"
          />
          
          <Select
            label="Default Font Family"
            value={fontFamily}
            onChange={setFontFamily}
            data={[
              { value: 'Arial', label: 'Arial' },
              { value: 'Times New Roman', label: 'Times New Roman' },
              { value: 'Calibri', label: 'Calibri' },
              { value: 'Georgia', label: 'Georgia' },
              { value: 'Verdana', label: 'Verdana' },
            ]}
          />
          
          <Select
            label="Default Font Size"
            value={fontSize}
            onChange={setFontSize}
            data={[
              { value: '12', label: '12px' },
              { value: '14', label: '14px' },
              { value: '16', label: '16px' },
              { value: '18', label: '18px' },
              { value: '20', label: '20px' },
            ]}
          />
          
          <ColorInput
            label="Default Text Color"
            value={textColor}
            onChange={setTextColor}
            format="hex"
            swatches={['#000000', '#228be6', '#40c057', '#fa5252', '#fd7e14']}
          />
          
          <Divider />
          
          <Text size="sm" color="dimmed">
            <IconInfoCircle size={14} style={{ marginRight: 8 }} />
            These settings will be applied to new documents. Current document formatting will not be affected.
          </Text>
        </Stack>
      </Modal>

      {/* Citation Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionDropdown
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          position={dropdownPosition}
        />
      )}
    </Container>
  );
}

export default App;
