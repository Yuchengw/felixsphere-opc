"use client";

import { useEffect, useState } from "react";

interface Doc {
  id: string;
  title: string;
  description: string | null;
  templateKey: string;
  status: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
      setLoading(false);
    }
    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-1">
          Templates and generated documents for your company
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {doc.description}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs bg-muted rounded px-2 py-0.5 text-muted-foreground capitalize">
                    {doc.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No documents yet. Complete the setup wizard to generate your document templates.
          </p>
          <a
            href="/setup"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Setup
          </a>
        </div>
      )}
    </div>
  );
}
