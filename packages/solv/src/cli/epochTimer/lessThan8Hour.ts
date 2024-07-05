import { EpochData } from './epochTimer'
import { EpochInfoType } from '@/lib/getEpochInfo'
import writeEpochDataToFile from './writeEpochDataToFile'
import alertMessage from './alertMessage'

const lessThan8Hour = async (
  totalMinutes: number,
  epochData: EpochData,
  currentEpoch: EpochInfoType,
  isMEV: boolean = false,
) => {
  if (
    totalMinutes < 8 * 60 &&
    totalMinutes >= 60 &&
    !epochData.isLessThan8Hours
  ) {
    // Update the database and send a notification
    await writeEpochDataToFile({ ...epochData, isLessThan8Hours: true })
    await alertMessage(currentEpoch, '8 Hours')
  }
}

export default lessThan8Hour
