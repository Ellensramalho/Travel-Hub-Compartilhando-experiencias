import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./UploadPost.css";

export default function UploadPost() {
  const [image, setImage] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const handleUpload = async () => {
    if (!image) {
      alert("Selecione uma imagem antes de postar!");
      return;
    }

    try {
      setLoading(true);

      const safeName = image.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");

      const fileName = `${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, image, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("posts").insert({
        description: descricao,
        imageUrl,
        likes: 0,
      });

      if (insertError) throw insertError;

      // Exibir tooltip
      setTooltip(true);
      setTimeout(() => setTooltip(false), 2500);

      setDescricao("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("❌ Ocorreu um erro. Veja o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <h3>Compartilhe suas experiências</h3>

      {image && (
        <img
          className="preview animate"
          src={URL.createObjectURL(image)}
          alt="Pré-visualização"
        />
      )}

      <textarea
        placeholder="Conte sua experiência..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="text-input"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="file-input"
      />

      <button onClick={handleUpload} disabled={loading} className="send-btn">
        {loading ? "Enviando..." : "Postar"}
      </button>

      {tooltip && <div className="tooltip">Foto enviada com sucesso! ✅</div>}
    </div>
  );
}

