📋 Task Pulse

Este projeto consiste em uma aplicação fullstack para gerenciamento de tarefas, com funcionalidades como notificações em tempo real, download de anexos, controle de status, e regras de negócio bem definidas. O foco do projeto foi demonstrar boas práticas de arquitetura, organização de código, clareza de decisões técnicas e robustez da aplicação.

Frontend (React + TypeScript)

React + TypeScript
Tipagem forte, maior segurança em tempo de desenvolvimento e melhor DX.

Ant Design (antd)
Biblioteca madura, consistente e produtiva para construção de interfaces.

Uso de componentes como Card, Badge, Dropdown, List, Spin, etc.

Axios
Cliente HTTP simples, poderoso e com ótimo suporte a interceptors e blobs (usado no download de arquivos).

🔔 Sistema de Notificações

As notificações são buscadas periodicamente (polling).

O sino exibe badge com a quantidade de notificações não lidas.

Cada notificação é marcada como lida individualmente, somente quando o usuário interage com ela.

Foi adicionado loading antes do fetch, garantindo melhor feedback visual ao usuário.

📎 Download de Anexos

Um dos pontos mais desafiadores do frontend foi o download correto de arquivos:

Solução adotada:

O backend retorna o arquivo via File(...), preservando o nome original.

O frontend faz a requisição com responseType: 'blob'.

O nome do arquivo é extraído diretamente do header Content-Disposition.

Foi necessário expor explicitamente os headers no CORS para que o navegador pudesse acessá-los.

Isso garante que:

O arquivo seja baixado pelo navegador.

O nome e o tipo do arquivo sejam preservados corretamente (PNG, PDF, etc).

⚠️ Maiores Desafios do Teste

Garantir consistência entre backend e frontend, especialmente em regras de negócio.

Implementar corretamente o download de arquivos via browser, respeitando headers e CORS.

Lidar com notificações não lidas sem marcar todas automaticamente.

Evitar dependência de valores baseados apenas no que está visível na tela (ex: contagens dinâmicas).

Manter o código limpo, legível e bem separado mesmo com o tempo limitado do teste.

⏰ Tarefas Expiradas — Decisão de Negócio

Foi uma decisão consciente permitir a conclusão de tarefas mesmo após a expiração.

Motivos:

Em cenários reais, atrasos podem ocorrer por fatores externos.

Bloquear totalmente a conclusão poderia gerar frustração e perda de controle do histórico.

O sistema mantém a informação de que a tarefa estava expirada, mas não impede a ação.

👉 Essa abordagem privilegia flexibilidade, experiência do usuário e rastreamento histórico, sem comprometer a integridade dos dados.

✅ Considerações Finais

O projeto foi desenvolvido com foco em:

Boas práticas de engenharia de software

Código limpo e organizado

Decisões técnicas justificadas

Escalabilidade e manutenção futura