import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import '../App.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// --- COMPONENTE DO FLASHCARD ---
function Flashcard({ question, answer, index, onSave, isFocusMode = false }) {
  const [flipped, setFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState(question);
  const [editAnswer, setEditAnswer] = useState(answer);

  useEffect(() => {
    setFlipped(false);
    setIsEditing(false);
    setEditQuestion(question);
    setEditAnswer(answer);
  }, [question, answer]);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave(index, editQuestion, editAnswer);
    setIsEditing(false);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setEditQuestion(question);
    setEditAnswer(answer);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '2px dashed #94a3b8',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: isFocusMode ? '400px' : '200px',
          width: '100%',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <label style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Editar Pergunta</label>
        <textarea 
          value={editQuestion}
          onChange={(e) => setEditQuestion(e.target.value)}
          style={{ 
            width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', 
            border: '1px solid #cbd5e1', marginBottom: '15px', fontFamily: 'inherit', 
            resize: 'vertical', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '1rem', boxSizing: 'border-box'
          }}
        />

        <label style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '5px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Editar Resposta</label>
        <textarea 
          value={editAnswer}
          onChange={(e) => setEditAnswer(e.target.value)}
          style={{ 
            width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', 
            border: '1px solid #cbd5e1', marginBottom: '15px', fontFamily: 'inherit', 
            resize: 'vertical', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '1rem', boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={handleSaveClick} style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            💾 Salvar
          </button>
          <button onClick={handleCancelClick} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            ✖ Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      style={{
        backgroundColor: flipped ? '#f0fdf4' : '#ffffff',
        border: flipped ? '2px solid #10b981' : '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: isFocusMode ? '40px' : '24px',
        cursor: 'pointer',
        boxShadow: isFocusMode ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isFocusMode ? '450px' : '200px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}
      onMouseEnter={(e) => { if(!isFocusMode) e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
      onMouseLeave={(e) => { if(!isFocusMode) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'}}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isFocusMode ? '30px' : '16px' }}>
        <span style={{ color: flipped ? '#10b981' : '#3b82f6', fontWeight: '800', fontSize: isFocusMode ? '1rem' : '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {flipped ? 'Resposta' : 'Pergunta'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '5px', color: '#64748b', borderRadius: '50%' }}
            title="Editar Cartão"
          >
            ✏️
          </button>
          <span style={{ color: '#cbd5e1', fontWeight: '800', fontSize: isFocusMode ? '1.2rem' : '0.85rem' }}>
            #{index + 1}
          </span>
        </div>
      </div>

      {!flipped ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ color: '#0f172a', fontSize: isFocusMode ? '1.8rem' : '1.15rem', margin: '0 0 15px 0', lineHeight: '1.5', fontWeight: '800', textAlign: 'center' }}>
            <ReactMarkdown
               components={{
                 p: ({node, ...props}) => <p style={{ margin: 0 }} {...props} />,
                 strong: ({node, ...props}) => <strong style={{ color: '#8b5cf6' }} {...props} /> 
               }}
            >
              {question}
            </ReactMarkdown>
          </h3>
          <p style={{ color: '#94a3b8', fontSize: isFocusMode ? '1rem' : '0.85rem', marginTop: 'auto', borderTop: '1px dashed #e2e8f0', paddingTop: '15px', textAlign: 'center' }}>
            👆 Clique na carta para revelar
          </p>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#1e293b', fontSize: isFocusMode ? '1.5rem' : '1.1rem', lineHeight: '1.6', textAlign: 'center', fontWeight: '500' }}>
            <ReactMarkdown
               components={{
                 p: ({node, ...props}) => <p style={{ margin: '0 0 10px 0' }} {...props} />,
                 ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0', textAlign: 'left' }} {...props} />,
                 li: ({node, ...props}) => <li style={{ marginBottom: '5px' }} {...props} />,
                 strong: ({node, ...props}) => <strong style={{ color: '#0f172a', fontWeight: '800', backgroundColor: '#fef08a', padding: '2px 4px', borderRadius: '4px' }} {...props} />,
               }}
            >
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// --- APP PRINCIPAL ---
// Nota para integração: Se este componente for inserido dentro de um componente Pai, 
// você pode passar uma prop como `onGenerated={suaFuncao}` para substituir o alert nativo.
function AutoFlashcardsPage({ onGenerated }) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); 
  const [error, setError] = useState('');
  
  const [viewMode, setViewMode] = useState('none'); 
  const [presentationMode, setPresentationMode] = useState('grid'); 
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0); 
  
  const [mnemonicsResult, setMnemonicsResult] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    if (fileType !== "text/plain" && fileType !== "application/pdf") {
      setError("Por favor, envie apenas arquivos .TXT ou .PDF");
      return;
    }

    setFileName(file.name);
    setError('');
    setMnemonicsResult('');
    setFlashcards([]);
    setViewMode('none');
    setPresentationMode('grid');
    setCurrentFocusIndex(0);
    
    try {
      if (fileType === "application/pdf") {
        setLoading(true);
        setLoadingType('pdf_reading'); 
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        setFileContent(fullText); 
        setLoading(false);
        setLoadingType('');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => setFileContent(e.target.result);
        reader.readAsText(file);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao processar o arquivo: " + err.message);
      setLoading(false);
      setLoadingType('');
    }
  };

  const checkPreRequisites = () => {
    if (!apiKey) {
      setError("Por favor, insira sua Chave de API do Gemini.");
      return false;
    }
    if (!fileContent) {
      setError("Por favor, faça o upload de um arquivo primeiro.");
      return false;
    }
    return true;
  };

  const generateMnemonics = async () => {
    if (!checkPreRequisites()) return;
    
    setLoading(true);
    setLoadingType('mnemonics');
    setError('');
    setCopied(false);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptSistema = `
        Atue como um especialista em neuroeducação e caçador de mnemônicos.
        Extraia truques, macetes, associações e mnemônicos escondidos na ortografia, gatilhos de exclusão e associações visuais bizarras.
        Categorize em: 1. Siglas, 2. Associações Visuais, 3. Raciocínio, 4. Pegadinhas.
        NÃO USE TABELAS. Use listas em bullet points.
        TEXTO: ${fileContent}
      `;

      const apiResult = await model.generateContent(promptSistema);
      setMnemonicsResult(apiResult.response.text());
      setViewMode('mnemonics');
    } catch (err) {
      console.error(err);
      setError(`Falha na API: ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingType('');
    }
  };

  const generateFlashcards = async () => {
    if (!checkPreRequisites()) return;

    setLoading(true);
    setLoadingType('flashcards');
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptSistema = `
        Atue como um especialista em aprendizagem baseada em flashcards (Active Recall) e criador de questões para provas médicas.
        Sua tarefa é ler o documento fornecido e gerar flashcards curtos, objetivos e ideais para revisão rápida.

        REGRAS OBRIGATÓRIAS (CRÍTICAS):
        1. UM CONCEITO POR CARTA: Cada flashcard deve abordar APENAS UM conceito.
        2. RESPOSTAS CURTAS: Cada resposta deve ter NO MÁXIMO 1 frase curta ou até 15 palavras. Foco na resposta instintiva.
        3. PROIBIDO PERGUNTAS AMPLAS: NÃO crie perguntas do tipo "descreva", "explique", "compare" ou "fale sobre".
        4. PERGUNTAS FECHADAS: Prefira perguntas diretas ("Qual é o...", "Qual o pH...", "Qual o tratamento...").
        5. FRAGMENTAÇÃO INTELIGENTE: Se um tema tiver múltiplos pontos, gere múltiplos flashcards curtos.
        6. MNEMÔNICOS OBRIGATÓRIOS: Você DEVE identificar macetes, dicas de prova, associações de letras ou visuais do texto e criar flashcards específicos para eles.
        7. PENSE: "Isso cabe em 5 a 10 segundos de resposta?" Se sim, a carta está boa.

        FORMATO OBRIGATÓRIO (Siga exatamente este padrão, separando as cartas com "==="):
        Q: [Pergunta direta e curta]
        A: [Resposta de até 15 palavras]
        ===

        TEXTO PARA ANÁLISE:
        ${fileContent}
      `;

      const apiResult = await model.generateContent(promptSistema);
      const textResponse = apiResult.response.text();
      
      const rawCards = textResponse.split('===');
      const uniqueCards = [];
      const seenQuestions = new Set(); 

      rawCards.forEach(cardStr => {
        const qMatch = cardStr.match(/Q:\s*([\s\S]*?)(?=A:|$)/);
        const aMatch = cardStr.match(/A:\s*([\s\S]*?)$/);
        
        if (qMatch && aMatch) {
          const rawQuestion = qMatch[1].trim();
          const answer = aMatch[1].trim();
          const normalizedQuestion = rawQuestion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').trim();

          if (!seenQuestions.has(normalizedQuestion) && rawQuestion.length > 5) {
            seenQuestions.add(normalizedQuestion);
            uniqueCards.push({ question: rawQuestion, answer: answer });
          }
        }
      });

      if (uniqueCards.length === 0) throw new Error("A IA não retornou o formato esperado. Tente analisar novamente.");
      
      setFlashcards(uniqueCards);
      setViewMode('flashcards');
      setPresentationMode('grid'); 
      setCurrentFocusIndex(0);
    } catch (err) {
      console.error(err);
      setError(`Falha na API: ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingType('');
    }
  };

  const handleUpdateFlashcard = (index, newQuestion, newAnswer) => {
    const updatedCards = [...flashcards];
    updatedCards[index] = { question: newQuestion, answer: newAnswer };
    setFlashcards(updatedCards);
  };

  const nextCard = () => {
    if (currentFocusIndex < flashcards.length - 1) setCurrentFocusIndex(currentFocusIndex + 1);
  };
  const prevCard = () => {
    if (currentFocusIndex > 0) setCurrentFocusIndex(currentFocusIndex - 1);
  };

  const copyMnemonics = () => {
    navigator.clipboard.writeText(mnemonicsResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // --- NOVA FUNÇÃO: ENVIAR PARA O SISTEMA ---
  const handleSendToSystem = () => {
    // Caso você passe a função de envio pelo Componente Pai
    if (onGenerated) {
      const baseFolderName = (fileName || 'Central de Estudos IA').replace(/\.[^/.]+$/, '').trim();
      onGenerated({ cards: flashcards, sourceFileName: baseFolderName || 'Central de Estudos IA' });
      return;
    }

    // Caso não exista Prop, aqui é onde você coloca o código que envia para a sua API ou banco de dados global.
    // Exemplo:
    // fetch('/api/salvar-flashcards', { method: 'POST', body: JSON.stringify(flashcards) })
    
    console.log("JSON pronto para o sistema principal:", JSON.stringify(flashcards, null, 2));
    alert(`Sucesso! ${flashcards.length} flashcards prontos para integração.\n(Verifique o Console do Navegador para ver o JSON gerado).`);
  };

  const styles = {
    page: { width: '100%', backgroundColor: 'transparent', padding: '0', fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#0f172a', boxSizing: 'border-box', position: 'relative' },
    container: { width: '100%', maxWidth: 'none', margin: '0', boxSizing: 'border-box' },
    headerText: { textAlign: 'center', color: '#1e1b4b', fontSize: '2.5rem', marginBottom: '10px', fontWeight: '800' },
    subText: { textAlign: 'center', color: '#64748b', fontSize: '1.1rem', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px', width: '100%', maxWidth: 'none', margin: '0 0 24px 0', boxSizing: 'border-box' },
    label: { display: 'block', marginBottom: '12px', fontWeight: '700', color: '#475569', fontSize: '0.95rem', textAlign: 'center' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box', letterSpacing: '2px' },
    dropzone: { padding: '40px 20px', border: '2px dashed #a78bfa', borderRadius: '12px', textAlign: 'center', backgroundColor: '#fdfcff', marginTop: '30px', transition: 'all 0.2s ease' },
    buttonRow: { display: 'flex', gap: '15px', marginTop: '35px', flexWrap: 'wrap' },
    btnMnemonic: { flex: 1, padding: '14px 20px', fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: loading ? '#cbd5e1' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', minWidth: '200px', transition: '0.2s' },
    btnFlashcard: { flex: 1, padding: '14px 20px', fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: loading ? '#cbd5e1' : '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', minWidth: '200px', transition: '0.2s' },
    errorBox: { backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '16px', borderRadius: '0 8px 8px 0', marginTop: '20px' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', alignItems: 'stretch' },
    focusContainer: { backgroundColor: '#f1f5f9', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' },
    focusHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '30px', fontWeight: '800', fontSize: '1.1rem' },
    focusCarousel: { display: 'flex', alignItems: 'center', gap: '30px', width: '100%', justifyContent: 'center' },
    carouselBtn: { backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <h1 style={styles.headerText}>🧠 Central de Estudos IA</h1>
        <p style={styles.subText}>Extração de PDF: Flashcards Editáveis e Mnemônicos.</p>

        <div style={styles.card}>
          <div>
            <label style={styles.label}>🔑 Chave de API do Google Gemini (Salva no navegador)</label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Cole sua chave aqui (AIzaSy...)"
                style={{ ...styles.input, flex: 1 }}
              />
              {apiKey && (
                <button 
                  onClick={() => setApiKey('')}
                  style={{ padding: '0 20px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                  title="Apagar chave atual para colocar uma nova"
                >
                  Trocar Chave
                </button>
              )}
            </div>
          </div>

          <div style={styles.dropzone}>
            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ color: '#8b5cf6', fontWeight: '700', fontSize: '1.2rem', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📄 Envie seu arquivo em .PDF ou .TXT
              </p>
              
              <input type="file" accept=".txt, .pdf, application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
              
              <div style={{ padding: '10px 24px', backgroundColor: '#ffffff', color: '#6366f1', border: '1px solid #ddd6fe', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: '0.2s' }}>
                Procurar Arquivo no Computador
              </div>
            </label>

            {loadingType === 'pdf_reading' && <div style={{marginTop: '25px', color: '#8b5cf6', fontWeight: 'bold'}}>Lendo e convertendo PDF... ⏳</div>}
            
            {fileName && loadingType !== 'pdf_reading' && (
              <div style={{ display: 'inline-block', marginTop: '25px', padding: '8px 20px', backgroundColor: '#dcfce3', color: '#166534', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: '700', border: '1px solid #bbf7d0' }}>
                ✓ {fileName} carregado
              </div>
            )}
          </div>

          {error && <div style={styles.errorBox}><b>Atenção:</b> {error}</div>}

          <div style={styles.buttonRow}>
            <button onClick={generateMnemonics} disabled={loading} style={styles.btnMnemonic}>
              {loadingType === 'mnemonics' ? 'Procurando... ⏳' : '🔍 Caçar Mnemônicos'}
            </button>
            <button onClick={generateFlashcards} disabled={loading} style={styles.btnFlashcard}>
              {loadingType === 'flashcards' ? 'Minerando cartas... ⏳' : '⚡ Gerar Flashcards Clínicos'}
            </button>
          </div>
        </div>

        {viewMode === 'mnemonics' && mnemonicsResult && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderTop: '6px solid #6366f1' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: '#1e1b4b', fontSize: '1.8rem', fontWeight: 'bold' }}>🔍 Mnemônicos Encontrados</h2>
              <button onClick={copyMnemonics} style={{ padding: '8px 16px', backgroundColor: copied ? '#10b981' : '#f1f5f9', color: copied ? '#fff' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>{copied ? '✓ Copiado!' : '📋 Copiar Resumo'}</button>
            </div>
            
            <div style={{ color: '#1e293b', width: '100%' }}>
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 style={{ color: '#ffffff', backgroundColor: '#6366f1', padding: '10px 20px', borderRadius: '8px', fontSize: '1.4rem', marginTop: '40px', marginBottom: '20px', display: 'inline-block' }} {...props} />,
                  h3: ({node, ...props}) => <h3 style={{ color: '#0f172a', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }} {...props} />,
                  ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '30px' }} {...props} />,
                  li: ({node, ...props}) => <li style={{ marginBottom: '12px', lineHeight: '1.7', color: '#334155' }} {...props} />,
                  strong: ({node, ...props}) => <strong style={{ color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #fcd34d' }} {...props} />,
                  p:  ({node, ...props}) => <p style={{ color: '#1e293b', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '16px' }} {...props} />,
                }}
              >
                {mnemonicsResult}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {viewMode === 'flashcards' && flashcards.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚡</span>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
                  {presentationMode === 'grid' ? 'Painel de Flashcards' : 'Treino Livre'}
                </h2>
                <span style={{ marginLeft: '15px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {flashcards.length} cartas prontas
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '4px', marginRight: '15px' }}>
                  <button onClick={() => setPresentationMode('grid')} style={{ padding: '8px 16px', backgroundColor: presentationMode === 'grid' ? '#ffffff' : 'transparent', border: 'none', borderRadius: '6px', fontWeight: 'bold', color: presentationMode === 'grid' ? '#0ea5e9' : '#64748b', cursor: 'pointer', boxShadow: presentationMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    📑 Grade
                  </button>
                  <button onClick={() => setPresentationMode('focus')} style={{ padding: '8px 16px', backgroundColor: presentationMode === 'focus' ? '#ffffff' : 'transparent', border: 'none', borderRadius: '6px', fontWeight: 'bold', color: presentationMode === 'focus' ? '#0ea5e9' : '#64748b', cursor: 'pointer', boxShadow: presentationMode === 'focus' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    🎯 Treino Livre
                  </button>
                </div>

                {/* --- NOVO BOTÃO DE INTEGRAÇÃO COM O SISTEMA --- */}
                <button 
                  onClick={handleSendToSystem} 
                  style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                >
                  📤 Enviar para o Sistema
                </button>
              </div>
            </div>
            
            {presentationMode === 'grid' ? (
              <div style={styles.gridContainer}>
                {flashcards.map((card, index) => (
                  <Flashcard key={index} index={index} question={card.question} answer={card.answer} onSave={handleUpdateFlashcard} isFocusMode={false} />
                ))}
              </div>
            ) : (
              <div style={styles.focusContainer}>
                <div style={styles.focusHeader}>
                  <span>Treino Livre</span>
                  <span>{currentFocusIndex + 1} / {flashcards.length}</span>
                </div>
                
                <div style={styles.focusCarousel}>
                  <button 
                    onClick={prevCard} 
                    disabled={currentFocusIndex === 0} 
                    style={{ ...styles.carouselBtn, opacity: currentFocusIndex === 0 ? 0.3 : 1, cursor: currentFocusIndex === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    ❮
                  </button>
                  
                  <div style={{ width: '100%' }}>
                    <Flashcard 
                      key={currentFocusIndex} 
                      index={currentFocusIndex} 
                      question={flashcards[currentFocusIndex].question} 
                      answer={flashcards[currentFocusIndex].answer} 
                      onSave={handleUpdateFlashcard}
                      isFocusMode={true} 
                    />
                  </div>

                  <button 
                    onClick={nextCard} 
                    disabled={currentFocusIndex === flashcards.length - 1} 
                    style={{ ...styles.carouselBtn, opacity: currentFocusIndex === flashcards.length - 1 ? 0.3 : 1, cursor: currentFocusIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ❯
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AutoFlashcardsPage;