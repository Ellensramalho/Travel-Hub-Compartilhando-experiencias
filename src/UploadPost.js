import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./UploadPost.css";

export default function UploadPost() {
  const [image, setImage] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) {
      alert("Selecione uma imagem antes de postar!");
      return;
    }

    try {
      setLoading(true);

      // Criar nome único
      const fileName = `${Date.now()}-${image.name}`;

      // 🔥 1. Fazer upload da imagem no Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posts") // ⚠️ CERTIFIQUE-SE QUE O BUCKET CHAMA "posts"
        .upload(fileName, image);

      if (uploadError) {
        console.error(uploadError);
        alert("Erro ao fazer upload da imagem.");
        return;
      }

      // 🔥 2. Gerar URL pública
      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 🔥 3. Salvar post no banco
      const { error: insertError } = await supabase.from("posts").insert({
        description: descricao,
        imageUrl,
        likes: 0,
        created_at: new Date(),
      });

      if (insertError) {
        console.error(insertError);
        alert("Erro ao criar o post.");
        return;
      }

      alert("📸 Post enviado com sucesso!");
      setDescricao("");
      setImage(null);
    } catch (err) {
      console.error("Erro geral:", err);
      alert("❌ Erro ao enviar post. Veja o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <h3>Compartilhe sua experiência ✨</h3>

      {/* Preview da imagem */}
      {image && (
        <img
          className="preview"
          src={URL.createObjectURL(image)}
          alt="Pré-visualização"
        />
      )}

      {/* Campo de descrição */}
      <textarea
        placeholder="Conte sua experiência..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="text-input"
      />

      {/* Selecionar imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="file-input"
      />

      {/* Botão de envio */}
      <button onClick={handleUpload} disabled={loading} className="send-btn">
        {loading ? "Enviando..." : "Postar"}
      </button>
    </div>
  );
}
