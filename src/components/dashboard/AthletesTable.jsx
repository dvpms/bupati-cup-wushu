import { STYLE } from "@/config/style";

export default function AthletesTable({ atlets }) {
  return (
    <section className={`bg-${STYLE.white} p-6 sm:p-8 ${STYLE.cardRadius} ${STYLE.cardShadow} border ${STYLE.border} container mx-auto px-6 ${STYLE.container}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Daftar Atlet</h2>
          <p className="text-sm text-gray-500 mt-1">Total {atlets.length} atlet telah ditambahkan.</p>
        </div>
        <button className={`mt-4 sm:mt-0 flex items-center space-x-2 ${STYLE.buttonPrimary} font-bold py-2 px-5 rounded-lg transition-colors`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          <span>Tambah Atlet Lain</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Atlet</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori Diikuti</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {atlets.map((atlet, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{atlet.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{atlet.kategori}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{atlet.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button className="text-purple-600 hover:text-purple-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-black text-gray-800">Siap Menyelesaikan Pendaftaran?</h3>
          <p className="text-sm text-gray-600">Lakukan pembayaran untuk semua atlet yang terdaftar untuk mengamankan slot mereka.</p>
        </div>
        <button className={`mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span>Lakukan Pembayaran</span>
        </button>
      </div>
    </section>
  );
}
